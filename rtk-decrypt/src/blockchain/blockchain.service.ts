import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import {
  BLOCK_REPOSITORY_TOKEN,
  DB_CONNECTION_TOKEN,
  TX_REPOSITORY_TOKEN,
  VOTE_REPOSITORY_TOKEN,
} from '../common.constants'
import { Connection, MoreThan, QueryRunner, Repository } from 'typeorm'
import { Block } from '../entities/block.entity'
import { STORED_TX_OPERATIONS, Tx, VotingOperation } from '../entities/tx.entity'
import { InjectEventEmitter } from 'nest-emitter'
import { EventBus } from '../types/event-bus'
import { ContractState } from '../types/general'
import { getDateFromStr } from '../utils/date-utils'
import { Vote } from '../entities/vote.entity'
import { ConfigService } from '../config/config.service'

@Injectable()
export class BlockchainService implements OnApplicationBootstrap, OnApplicationShutdown {

  private qr: QueryRunner

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    @Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection,
    @Inject(BLOCK_REPOSITORY_TOKEN) private readonly blockRepository: Repository<Block>,
    @Inject(TX_REPOSITORY_TOKEN) private readonly txRepository: Repository<Tx>,
    @Inject(VOTE_REPOSITORY_TOKEN) private readonly voteRepository: Repository<Vote>,
    @InjectEventEmitter() private readonly eventBus: EventBus,
  ) {
    this.qr = this.connection.createQueryRunner()
    this.loggerService.setContext(BlockchainService.name)
  }

  async onApplicationBootstrap() {
    await this.qr.connect()
    await this.bindHandlers()
    await this.startSync()
  }

  async onApplicationShutdown() {
    this.unbindHandlers()
    if (!this.qr.isReleased) {
      this.loggerService.warn('Releasing connection')
      await this.qr.release()
    }
  }

  async getLastBlockSignature(): Promise<Uint8Array | undefined> {
    try {
      const { signature } = await this.getCurrentBlockInfo()
      return signature
    } catch (e) {
      return undefined
    }
  }

  getCurrentBlockInfo(): Promise<{ createdAt: Date, signature: Uint8Array, height: number }> {
    return this.blockRepository.findOneOrFail({
      select: ['createdAt', 'signature', 'height'],
      order: {
        height: 'DESC',
      },
    })
  }

  async startSync() {
    const signature = await this.getLastBlockSignature() || this.configService.getDevStartFromBlock()
    this.loggerService.verbose(`Start sync from ${signature ? signature.toString('hex') : 'the beginning'}`)
    this.eventBus.emit('startSync', signature)
  }

  bindHandlers() {
    this.eventBus.on('blockReceived', this.processBlock.bind(this))
    this.eventBus.on('notFound', this.rollbackLastBlock.bind(this))
    this.eventBus.on('rollback', this.rollbackToBlockSignature.bind(this))
    this.eventBus.on('connected', this.startSync.bind(this))
  }

  unbindHandlers() {
    this.eventBus.removeAllListeners()
  }

  async processBlock(block: Block, txs: Tx[]) {
    this.eventBus.emit('pauseSync')

    const filtered = txs.filter(({ operation }) => STORED_TX_OPERATIONS.includes(operation))

    const votes = txs
      .filter(({ operation }) => operation === VotingOperation.vote)
      .map((vote): Vote => {
        const failed = Object.keys(vote.diff).some(key => key.indexOf('FAIL_') > -1)
        return {
          ...vote,
          failed,
          valid: failed ? false : undefined,
          processed: failed,
          vote: vote.params.vote,
        }
      })

    await this.saveBlock(block, filtered, votes)

    this.eventBus.emit('blockParsed', block.height)

    this.eventBus.emit('resumeSync')
  }

  async saveBlock(block: Block, txs: Tx[], votes: Vote[]) {
    try {
      await this.qr.startTransaction()
      await this.blockRepository.save(block)
      await this.txRepository.save(txs)
      await this.qr.manager.save(this.voteRepository.create(votes))
      await this.qr.commitTransaction()

    } catch (e) {
      this.loggerService.error(e)
      await this.qr.rollbackTransaction()
    }
  }

  async rollbackToBlockSignature(signature: Uint8Array) {
    try {
      const { height } = await this.blockRepository.findOneOrFail({ signature })
      await this.rollback(height)
      this.eventBus.emit('resumeSync')
    } catch (e) {
      this.loggerService.error(`block with signature ${Buffer.from(signature).toString('hex')} not found`)
      this.rollbackLastBlock()
    }
  }

  async rollbackLastBlock() {
    const blocks = await this.blockRepository.find({
      select: ['height', 'signature'],
      order: { height: 'DESC' },
      take: 1,
      skip: 1,
    })
    if (blocks.length) {
      await this.rollback(blocks[0].height)
    }
    const signature = blocks.length ? blocks[0].signature : undefined
    this.eventBus.emit('startSync', signature)
  }

  async rollback(height: number) {
    this.loggerService.warn(`Rollback to height ${height}`)
    await Promise.all([
      this.blockRepository.delete({ height: MoreThan(height) }),
      this.txRepository.delete({ height: MoreThan(height) }),
      this.voteRepository.delete({ height: MoreThan(height) }),
    ])
  }

  async getContractState(contractId: Uint8Array): Promise<ContractState | undefined> {
    const txs = await this.txRepository.find({ where: { contractId }, order: { ts: 'ASC' } })

    if (txs.length) {
      const raw = txs.reduce((acc, { diff, params, operation }) => {
        if (operation === 'decryption') {
          const key = Object.keys(diff)[0]
          diff[key] = params.decryption
        }
        if (operation === 'commissionDecryption') {
          diff.COMMISSION_DECRYPTION = params.decryption
        }
        return { ...acc, ...diff }
      }, {}) as any

      const parsed = {} as ContractState

      const keys = Object.keys(raw) as Array<keyof ContractState>
      for (const key of keys) {
        if (['VOTING_BASE', 'VOTERS_LIST_REGISTRATORS', 'SERVERS', 'RESULTS'].includes(key)) {
          parsed[key] = JSON.parse(raw[key] as string)
        } else {
          parsed[key] = raw[key]
        }

        if (key === 'VOTING_BASE' && parsed.VOTING_BASE.dateStart) {
          parsed.VOTING_BASE.dateStart = getDateFromStr(parsed.VOTING_BASE.dateStart as any)
        }
        if (key === 'VOTING_BASE' && parsed.VOTING_BASE.dateEnd) {
          parsed.VOTING_BASE.dateEnd = getDateFromStr(parsed.VOTING_BASE.dateEnd as any)
        }
      }

      return parsed
    } else {
      return undefined
    }
  }

  async getVotesStat(contractId: Uint8Array, fullReport: boolean = false) {
    const query = this.voteRepository.createQueryBuilder('vote')
      .select(['COUNT(*) "all"', 'SUM(processed::INTEGER)::INTEGER "processed", COUNT(*) FILTER(WHERE NOT valid AND processed) "fail"'])
      .where({ contractId })

    if (fullReport) {
      query
        .addSelect('COUNT(DISTINCT sender_public_key) "unique"')
        .addSelect('COUNT(DISTINCT sender_public_key) FILTER(WHERE valid) "success"')
        .addSelect('COUNT(*) FILTER(WHERE NOT valid AND NOT failed AND processed) "validationFailed"')
        .addSelect('COUNT(*) FILTER(WHERE failed AND processed) "contractFailed"')

    }

    const stat = (await query.execute())[0]

    return {
      all: +stat.all,
      unique: +stat.unique || undefined,
      fail: +stat.fail,
      success: +stat.success || undefined,
      processed: +stat.processed,
      contractFailed: +stat.contractFailed || undefined,
      validationFailed: +stat.validationFailed || undefined,
    }
  }


}
