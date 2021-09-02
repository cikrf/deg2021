import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { EventBus } from '../types/event-bus'
import { InjectEventEmitter } from 'nest-emitter'
import {
  CONTRACT_CACHE_TTL,
  MAX_VALIDATION_TRIES,
  STREAMDB_CONNECTION_TOKEN,
  VOTE_REPOSITORY_TOKEN,
} from '../common.constants'
import { Connection, In, LessThan, Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { Vote } from '../entities/vote.entity'
import { CryptoService } from '../crypto/crypto.service'
import { fromHex } from '../crypto/utils'
import { contractKey } from '../utils/contract-key'
import { ConfigService } from '../config/config.service'
import { SumAB, ValidationResult } from '../crypto/types'
import { decode } from '@wavesenterprise/rtk-encrypt'
import { Master } from '../entities/master.entity'
import { ContractState } from '../types/general'
import { Bulletin } from '@wavesenterprise/rtk-encrypt/dist/types'

export type ContractInfo = {
  mainKey?: Uint8Array,
  lastAccess: number,
  dimension: number[][],
}

@Injectable()
export class CounterService implements OnApplicationBootstrap {
  private readonly chunkSize: number

  constructor(
    private readonly loggerService: LoggerService,
    private readonly blockchainService: BlockchainService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
    @InjectEventEmitter() private readonly eventBus: EventBus,
    @Inject(VOTE_REPOSITORY_TOKEN) private readonly voteRepository: Repository<Vote>,
    @Inject(STREAMDB_CONNECTION_TOKEN) private readonly connection: Connection,
  ) {
    this.loggerService.setContext(CounterService.name)
    this.chunkSize = this.configService.getValidationChunkSize()
    this.maxQueueLength = this.configService.getMaxQueueLength()
    this.sumChunkSize = this.configService.getSumChunkSize()
  }

  private contracts: Map<string, ContractInfo> = new Map()
  private validationRunning: boolean = false

  private readonly maxQueueLength: number
  private readonly sumChunkSize: number


  async onApplicationBootstrap() {
    await this.bindHandlers()
    this.cacheCleaner()
    this.tick()
  }

  private cacheCleaner() {
    this.contracts.forEach((contract, key) => {
      if (contract.lastAccess < Date.now() - CONTRACT_CACHE_TTL) {
        this.contracts.delete(key)
      }
    })
    setTimeout(this.cacheCleaner.bind(this), 1000)
  }

  bindHandlers() {
    this.eventBus.on('blockParsed', this.blockParsed.bind(this))
  }

  blockParsed() {
    if (!this.validationRunning) {
      this.tick()
    }
  }

  async tick() {
    this.validationRunning = true
    const chunk = await this.voteRepository.find({
      where: {
        processed: false,
        failed: false,
        retry: LessThan(MAX_VALIDATION_TRIES),
      },
      order: { index: 'ASC' },
      take: this.chunkSize,
    })

    if (!chunk.length) {
      this.validationRunning = false
      return
    }

    const start = Date.now()

    const promises = chunk.map(async (vote): Promise<ValidationResult> => {
      const contractInfo = await this.loadContractInfo(vote.contractId)
      if (!contractInfo) {
        return {
          valid: false,
          message: `Unknown contract hex: ${Buffer.from(vote.contractId).toString('hex')}`,
        }
      } else if (!contractInfo.mainKey) {
        return {
          valid: false,
          message: `Wrong MainKey for contract hex: ${Buffer.from(vote.contractId).toString('hex')}`,
        }
      } else {
        const { mainKey, dimension } = contractInfo
        try {
          const { valid, message } = await this.cryptoService.validateBulletin(vote.vote, Buffer.from(mainKey).toString('hex'), dimension)
          return {
            valid,
            message: !valid ? `${message} in txId hex: ${Buffer.from(vote.txId).toString('hex')}` : '',
          }
        } catch (e) {
          return {
            valid: false,
            retry: true,
            message: `${e.message} in txId hex: ${Buffer.from(vote.txId).toString('hex')}`,
          }
        }
      }
    })
    const validation = await Promise.all(promises) as ValidationResult[]
    const invalid = validation.filter((res) => !res.valid).length
    const height = chunk.reduce((acc, vote) => vote.height > acc ? vote.height : acc, 0)
    const time = ((Date.now() - start) / 1000).toFixed(3)
    const messages = [...(new Set(validation.filter(res => !res.valid).map(res => res.message)))]

    messages.map((message) => this.loggerService.error(message))

    this.loggerService.log(`Total ${chunk.length} / Invalid ${invalid} / Height: ${height} / ${time}s `)

    const validIndex = chunk.filter((_, idx) => validation[idx].valid).map((vote) => vote.index)
    const processedIndex = chunk.filter((_, idx) => !validation[idx].retry).map((vote) => vote.index)
    const retryIndex = chunk.filter((_, idx) => validation[idx].retry).map((vote) => vote.index)

    await this.voteRepository.update({ index: In(validIndex) }, { valid: true })
    await this.voteRepository.update({ index: In(processedIndex) }, { processed: true })
    await this.voteRepository.query('UPDATE vote SET retry = retry + 1 WHERE index = ANY($1)', [retryIndex])

    const unprocessed = await this.voteRepository.count({
      processed: false,
      failed: false,
      retry: LessThan(MAX_VALIDATION_TRIES),
    })
    if (unprocessed > 0) {
      setImmediate(this.tick.bind(this))
    } else {
      this.validationRunning = false
    }
  }

  async revalidate(): Promise<void> {
    const num = await this.voteRepository.update({ valid: false, failed: false }, { processed: false, retry: 0 })
    this.loggerService.warn(`Revalidating ${num.affected} txs`)
  }

  async uniqueNum(contractId: Uint8Array): Promise<number> {
    return +(await this.voteRepository.createQueryBuilder('vote')
      .select('COUNT(DISTINCT sender_public_key) "num"')
      .where({
        contractId,
        valid: true,
      })
      .execute())[0].num
  }

  async unprocessedNum(contractId: Uint8Array): Promise<number> {
    return +(await this.voteRepository.count({
      contractId,
      processed: false,
    }))
  }

  async sumVotes(poll: Master, state: ContractState, num: number): Promise<SumAB> {
    const dimension = state.VOTING_BASE.dimension.map(d => d[2])

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()

    const stream = await this.connection.createQueryBuilder<Vote>(Vote, 'vote', queryRunner)
      .select('DISTINCT ON (sender_public_key) vote "body"')
      .orderBy({
        sender_public_key: 'ASC',
        time_stamp: 'DESC',
      })
      .where({
        contractId: poll.contractId,
        valid: true,
      })
      .stream()

    const acc: SumAB[] = []
    let filled = 0
    let drained = 0

    this.loggerService.time(poll.id, 'Decode&Sum')
    const sum = await new Promise<SumAB>((resolve, reject) => {
      let finished = false
      let lock = false
      let processed = 0

      const timer = setInterval(() => {
        const percent = ((processed) / num * 100).toFixed(1)
        this.loggerService.debug(`[${poll.id}] ${percent}% votes decoded`)
      }, 5000)

      const count = async () => {
        if (lock) {
          return
        }
        lock = true
        while (acc.length > 1) {
          if (acc.length > this.maxQueueLength) {
            stream.pause()
            filled++
          }
          const ABs = acc.splice(0, this.sumChunkSize)
          const sums = await this.cryptoService.addVotes(ABs, dimension)
          acc.push(sums)
          processed += ABs.length
          num++
          if (acc.length < this.maxQueueLength && stream.isPaused()) { stream.resume() }
        }
        if (finished) {
          this.loggerService.debug(`[${poll.id}] 100% votes decoded`)
          clearInterval(timer)
          resolve(acc[0])
        }
        drained++
        lock = false
      }

      stream.on('data', async ({ body }: { body: Uint8Array }) => {
        try {
          acc.push(this.getABs(decode(body)))
          await count()
        } catch (err) {
          this.loggerService.error(err)
          clearInterval(timer)
          reject(err)
        }
      })

      stream.on('error', (err: unknown) => {
        this.loggerService.error(err)
        clearInterval(timer)
        reject(err)
      })

      stream.on('end', async () => {
        finished = true
        await count()
      })
    })

    await queryRunner.release()

    this.loggerService.timeEnd(poll.id, 'Decode&Sum')
    this.loggerService.debug(`[${poll.id}] Queue drained ${drained} times. Queue length reached max ${filled}`)

    return sum
  }

  getABs = ({ questions }: Bulletin): SumAB => {
    return questions.map(({ options }) => {
      return options.map((o) => {
        return {
          A: o.A,
          B: o.B,
        }
      })
    })
  }

  async loadContractInfo(contractId: Uint8Array): Promise<ContractInfo> {
    const key = contractKey(contractId)
    let contractInfo = this.contracts.get(key)
    if (!contractInfo) {
      const state = await this.blockchainService.getContractState(contractId)
      contractInfo = {
        mainKey: state && state.MAIN_KEY && [66, 130].includes(state.MAIN_KEY.length)
          ? fromHex(state.MAIN_KEY)
          : undefined,
        lastAccess: Date.now(),
        dimension: state ? state.VOTING_BASE.dimension : [],
      }
      this.contracts.set(key, contractInfo)
    } else {
      contractInfo.lastAccess = Date.now()
    }

    return contractInfo
  }

}
