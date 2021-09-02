import { HttpException, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { CryptoService } from '../crypto/crypto.service'
import { Master, MasterStatus } from '../entities/master.entity'
import { GrpcService } from '../grpc/grpc.service'
import { LoggerService } from '../logger/logger.service'
import { RabbitMQClient } from '../rabbit-mq'
import { MASTER_REPOSITORY_TOKEN } from '../common.constants'
import { AddCommissionPrivKeyRequestDTO } from './dto/add-commission-priv-key.dto'
import { AddCommissionPubKeyRequestDTO } from './dto/add-commission-pub-key.dto'
import { CreatePollRequestDTO } from './dto/create-poll-req.dto'
import { GetPollResponseDTO } from './dto/get-poll-resp.dto'
import * as bs58 from 'bs58'
import { contractKey } from '../utils/contract-key'
import { RecoverPollRequestDTO } from './dto/recover-poll-req.dto'
import { fromHex, toHex } from '../crypto/utils'
import { decrypt, encrypt } from '../utils/aes256-crypto'
import { ConfigService } from '../config/config.service'
import { ContractState, TxMiningAction } from '../types/general'
import { CounterService } from '../counter/counter.service'
import { BroadcastService } from '../grpc/broadcast.service'


@Injectable()
export class MasterService {
  constructor(
    private readonly broadcastService: BroadcastService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    private readonly grpcService: GrpcService,
    private readonly loggerService: LoggerService,
    private readonly blockchainService: BlockchainService,
    private readonly counterService: CounterService,
    @Inject(MASTER_REPOSITORY_TOKEN) private readonly masterRepository: Repository<Master>,
    private readonly rabbitMQClient: RabbitMQClient,
  ) {
    this.loggerService.setContext(MasterService.name)
    this.secret = this.configService.getAES256Secret()
  }

  private readonly secret: string

  async createPoll(request: CreatePollRequestDTO) {
    const exists = await this.masterRepository.findOne({ pollId: request.pollId })
    if (exists) {
      throw new HttpException(`Poll "${request.pollId}" already exists`, 400)
    }

    try {
      const { publicKey, privateKey } = this.cryptoService.generateKeyPair()

      const txId = await this.broadcastService.createPoll(request)
      const id = bs58.encode(txId)
      this.loggerService.log(`[${id}] Creating contract`)

      const encrypted = encrypt(privateKey, this.secret)

      const poll = this.masterRepository.create({
        id,
        contractId: Buffer.from(txId),
        pollId: request.pollId,
        publicKey,
        privateKey: encrypted,
      })
      await this.masterRepository.save(poll)

      await this.waitForTxMining(id, txId, MasterStatus.pollStarted, () => this.masterRepository.delete(poll.id))

      return id
    } catch (err) {
      this.loggerService.error(err.message, err.trace)
      throw new HttpException({ message: err.message }, err.status || 400)
    }
  }

  async addCommissionPubKey(request: AddCommissionPubKeyRequestDTO) {
    const { pollId } = request as { pollId: string } & AddCommissionPubKeyRequestDTO
    const { poll, state } = await this.loadPoll({ pollId })

    const commissionPubKey = fromHex(request.commissionPubKey)

    const isValid = this.cryptoService.validatePoint(commissionPubKey)

    if (!isValid) {
      throw new Error('commissionPubKey is not valid elliptic curve point')
    }

    if (state.VOTING_BASE.dateStart && state.VOTING_BASE.dateStart < new Date()) {
      throw new Error('Poll has started. CommissionPubKey rejected')
    }

    await this.checkStatus(poll, state, MasterStatus.pollStarted)
    const mainKey = this.cryptoService.addCommissionPublicKey(poll.publicKey, commissionPubKey)

    this.loggerService.log(`[${poll.id}] Sending addMainKey`)
    const txId = await this.broadcastService.addMainKey(
      poll.contractId,
      mainKey,
      toHex(poll.publicKey),
      toHex(commissionPubKey),
    )

    await this.waitForTxMining(poll.id, txId, MasterStatus.mainKeySent, MasterStatus.pollStarted)
  }

  async startVoting(pollId: string) {
    const { poll, state } = await this.loadPoll({ pollId })

    await this.checkStatus(poll, state, MasterStatus.mainKeySent)

    this.loggerService.log(`[${poll.id}] Sending startVoting`)
    const txId = await this.broadcastService.startVoting(poll.contractId)
    await this.waitForTxMining(
      poll.id,
      txId,
      MasterStatus.pollActive,
      (err) => this.loggerService.error(`[${poll.id}] Tx startVoting failed: ` + err?.message || err),
    )
  }

  async finalizePoll(pollId: string) {
    const { poll, state } = await this.loadPoll({ pollId })

    await this.checkStatus(poll, state, MasterStatus.pollActive)

    this.loggerService.log(`[${poll.id}] Sending finishVoting`)
    const txId = await this.broadcastService.finishVoting(poll.contractId)
    await this.waitForTxMining(
      poll.id,
      txId,
      MasterStatus.waitingCommissionKey,
      (err) => this.loggerService.error(`[${poll.id}] Tx finishVoting failed: ` + err?.message || err),
    )
  }

  async addCommissionPrivKey(request: AddCommissionPrivKeyRequestDTO) {
    const { pollId } = request as AddCommissionPrivKeyRequestDTO & { pollId: string }
    const { poll, state } = await this.loadPoll({ pollId })

    await this.checkStatus(poll, state, MasterStatus.waitingCommissionKey)

    if (!state.COMMISSION_KEY) {
      throw new Error('No commissionPubKey')
    }

    const publicKey = fromHex(state.COMMISSION_KEY)
    const commissionPrivKey = fromHex(request.commissionPrivKey, 32)
    const isValid = this.cryptoService.validatePrivateKey(publicKey, commissionPrivKey)
    if (!isValid) {
      throw new Error('commissionPrivKey is not valid')
    }
    const dimension = state.VOTING_BASE.dimension.map(d => d[2])

    const unprocessed = await this.counterService.unprocessedNum(poll.contractId)
    if (unprocessed) {
      throw new Error('Wait till all votes be verified')
    }

    try {
      const num = await this.counterService.uniqueNum(poll.contractId)

      let res: number[][] = dimension.map((options) => Array(options).fill(0))

      if (num === 0) {
        this.loggerService.warn(`[${poll.id}] No valid votes found`)

      } else {
        await this.updateStatus(poll.id, MasterStatus.prepareResults)
        const sum = await this.counterService.sumVotes(poll, state, num)

        this.loggerService.warn(`[${poll.id}] Calculation decryptions`)

        const masterKeyPair = {
          privateKey: decrypt(poll.privateKey, this.secret),
          publicKey: poll.publicKey,
        }
        const master = {
          ...masterKeyPair,
          decryption: this.cryptoService.decryption(sum, dimension, masterKeyPair),
        }

        const commissionKeyPair = {
          privateKey: commissionPrivKey,
          publicKey: fromHex(state.COMMISSION_KEY!),
        }
        const commission = {
          ...commissionKeyPair,
          decryption: this.cryptoService.decryption(sum, dimension, commissionKeyPair),
        }

        this.cryptoService.validateDecryption(sum, dimension, master)
        this.loggerService.warn(`[${poll.id}] Master decryption validated`)
        await this.broadcastService.decryption(poll.contractId, master.decryption)

        this.cryptoService.validateDecryption(sum, dimension, commission)
        this.loggerService.warn(`[${poll.id}] Commission decryption validated`)
        await this.broadcastService.commissionDecryption(poll.contractId, commission)

        this.loggerService.warn(`[${poll.id}] Calculation total result`)
        this.loggerService.time(poll.id, 'Calc')
        res = await this.cryptoService.calculateResults(sum, dimension, num, master, commission)
        this.loggerService.timeEnd(poll.id, 'Calc', `${num} ${JSON.stringify(res)}`)
      }


      this.loggerService.log(`[${poll.id}] Sending results: ${JSON.stringify(res)}`)
      const txId = await this.broadcastService.results(poll.contractId, res)
      await this.waitForTxMining(poll.id, txId, MasterStatus.resultsReady, MasterStatus.resultsFailed)
    } catch (err) {
      await this.updateStatus(poll.id, MasterStatus.waitingCommissionKey)
      this.loggerService.error(`[${poll.id}] ${err.message}`)
    }
  }

  async recoverPoll(request: RecoverPollRequestDTO) {
    const { txId } = request

    const privateKey = decrypt(fromHex(request.privateKey), request.secret)

    const exists = await this.masterRepository.findOne(txId)
    if (exists) {
      throw new HttpException('Poll with specified txId already exists', 400)
    }

    const contractId = bs58.decode(txId)
    const state = await this.blockchainService.getContractState(contractId)
    if (!state) {
      throw new HttpException('Poll with specified txId not found in blockchain', 400)
    }

    if (!state.DKG_KEY) {
      throw new HttpException('PublicKey of specified txId not found in blockchain', 400)
    }

    const publicKey = fromHex(state.DKG_KEY)

    const valid = this.cryptoService.validatePrivateKey(publicKey, privateKey)
    if (!valid) {
      throw new HttpException('Specified privateKey is not valid', 400)
    }

    const status = this.recoverStatus(state)

    const master = this.masterRepository.create({
      id: txId,
      pollId: state.VOTING_BASE.pollId,
      contractId,
      publicKey,
      privateKey: encrypt(privateKey, this.secret),
      status,
    })
    await this.masterRepository.save(master)
    return master.pollId
  }

  async votesStat(pollId: string) {
    const { poll } = await this.loadPoll({ pollId })
    const votesStat = await this.blockchainService.getVotesStat(poll.contractId, true)
    return {
      votesAll: votesStat.all,
      votesUnique: votesStat.unique,
      votesFail: votesStat.fail,
      votesSuccess: votesStat.success,
      votesProcessed: votesStat.processed,
      failsInfo: {
        contract: votesStat.contractFailed,
        validation: votesStat.validationFailed,
      },

    }
  }

  async getPoll(request: { pollId: string } | { id: string }): Promise<GetPollResponseDTO> {
    const { poll, state } = await this.loadPoll(request)

    const fullReport = [MasterStatus.resultsReady, MasterStatus.resultsFailed].includes(poll.status)
    const votesStat = await this.blockchainService.getVotesStat(poll.contractId, fullReport)

    const votingBase = state.VOTING_BASE

    return {
      blindSigExponent: votingBase.blindSigExponent,
      blindSigModulo: votingBase.blindSigModulo,
      bulletinHash: votingBase.bulletinHash,
      dimension: votingBase.dimension,
      mainKey: state.MAIN_KEY,
      status: poll.status,
      dateStart: votingBase.dateStart ? votingBase.dateStart.getTime() : undefined,
      dateEnd: votingBase.dateEnd ? votingBase.dateEnd.getTime() : undefined,
      results: state.RESULTS,
      votesAll: votesStat.all,
      votesUnique: votesStat.unique,
      votesFail: votesStat.fail,
      votesSuccess: votesStat.success,
      votesProcessed: votesStat.processed,
      failsInfo: fullReport ? {
        contract: votesStat.contractFailed,
        validation: votesStat.validationFailed,
      } : undefined,
      txId: poll.id,
      pollId: poll.pollId,
    }
  }

  private async checkStatus(poll: Master, state: ContractState, shouldBe: MasterStatus) {
    if (this.configService.getDisableStatusCheck()) {
      return
    }
    if (poll.status !== shouldBe) {
      const recovered = this.recoverStatus(state)
      await this.masterRepository.update(poll.id, { status: recovered })
      if (recovered === shouldBe) {
        this.loggerService.warn(`[${poll.id}] Recovered status is "${recovered}".`)
      } else {
        throw new Error(`Poll is not in "${shouldBe}" status (decrypt: ${poll.status}, blockchain: ${recovered})`)
      }
    }
  }

  // eslint-disable-next-line max-len
  private async loadPoll(request: { pollId: string } | { id: string }): Promise<{ poll: Master, state: ContractState }> {
    const poll = await this.masterRepository.findOne(request)
    if (!poll) {
      throw new Error('Poll does not exists')
    }

    const state = await this.blockchainService.getContractState(poll.contractId)
    if (!state) {
      throw new Error('Poll exists, but state is corrupted or not mined yet')
    }

    return { poll, state }
  }

  private async updateStatus(id: string, status: MasterStatus) {
    await this.masterRepository.update(id, { status })
    this.rabbitMQClient.publish(
      'updateStatus',
      {
        poll: await this.getPoll({ id }),
      },
      id,
    )
    this.loggerService.warn(`[${id}] set status ${status}`)
  }

  private async waitForTxMining(
    contractId: string,
    txId: Uint8Array,
    success: TxMiningAction,
    failure?: TxMiningAction,
  ) {
    try {
      const key = contractKey(txId)
      await this.grpcService.waitForTxMined(key)
      if (typeof success === 'string') {
        await this.updateStatus(contractId, success)
      } else if (typeof success === 'function') {
        await success()
      }
    } catch (err) {
      this.loggerService.error(`[${contractId}] ${err}`)
      if (failure && typeof failure === 'string') {
        await this.updateStatus(contractId, failure)
      } else if (failure && typeof failure === 'function') {
        await failure(err)
      }
    }
  }

  private recoverStatus(state: ContractState) {
    let status: MasterStatus
    if (state.RESULTS && Math.max(...state.RESULTS.flat()) !== 0) {
      status = MasterStatus.resultsReady
    } else if (state.RESULTS && Math.max(...state.RESULTS.flat()) === 0) {
      status = MasterStatus.resultsFailed
    } else if (state.VOTING_BASE.dateEnd && new Date() > state.VOTING_BASE.dateEnd) {
      status = MasterStatus.waitingCommissionKey
    } else if (state.VOTING_BASE.dateStart && new Date() > state.VOTING_BASE.dateStart) {
      status = MasterStatus.pollActive
    } else if (state.MAIN_KEY) {
      status = MasterStatus.mainKeySent
    } else {
      status = MasterStatus.pollStarted
    }
    return status
  }

}
