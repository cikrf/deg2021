import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { GrpcService } from '../grpc/grpc.service'
import { TX_REPOSITORY_TOKEN } from '../common.constants'
import { In, MoreThan, Repository } from 'typeorm'
import { BroadcastErrorStatus, Tx, TxStatus } from '../entities/tx.entity'
import { LoggerService } from '../logger/logger.service'
import { ConfigService } from '../config/config.service'
import { wavesenterprise as we } from '../grpc/proto/root'
import * as bs58 from 'bs58'
import { decodeBase64 } from '../utils/byte-utils'
import { sleep } from '../utils/sleep'

import {
  AlreadyInProcessingException,
  AlreadyInStateException,
  ContractNotFoundException,
  InvalidSignatureException,
  NotReadyException,
} from '../common.exceptions'

@Injectable()
export class TxWatcherService implements OnApplicationBootstrap {

  private warningShown: boolean = false

  constructor(
    private readonly configService: ConfigService,
    private readonly grpcService: GrpcService,
    private readonly loggerService: LoggerService,
    @Inject(TX_REPOSITORY_TOKEN) private readonly txRepository: Repository<Tx>,
  ) {
    this.loggerService.setContext(TxWatcherService.name)
  }

  onApplicationBootstrap() {
    this.tick()
  }

  async tick() {
    let processed = 0

    const ready = this.grpcService.readyClients().length
    const chunkSize = Math.min(this.grpcService.utxLeft(), this.configService.getGrpcChunkSize())

    if (ready && chunkSize > 0) {
      this.warningShown = false

      await this.rebroadcastPending()
      await this.failMaxRebroadcastCount()

      const txs = await this.takeTxsToProcessing(chunkSize)
      processed = txs.length

      const errors: Record<BroadcastErrorStatus, string[]> = {
        [BroadcastErrorStatus.INVALID_SIGNATURE]: [],
        [BroadcastErrorStatus.ALREADY_IN_THE_STATE]: [],
        [BroadcastErrorStatus.ALREADY_IN_PROCESSING]: [],
        [BroadcastErrorStatus.CONTRACT_NOT_FOUND]: [],
        [BroadcastErrorStatus.UNKNOWN]: [],
      }

      const notReady: string[] = []

      const promises = txs.map(async (tx) => {
        const id = bs58.encode(tx.callContractTransaction?.id!)
        try {
          await this.grpcService.broadcast(tx)
          this.loggerService.verbose(`Tx ${id} sent`)
        } catch (e) {
          if (e instanceof InvalidSignatureException) {
            errors[BroadcastErrorStatus.INVALID_SIGNATURE].push(id)
          } else if (e instanceof AlreadyInStateException) {
            errors[BroadcastErrorStatus.ALREADY_IN_THE_STATE].push(id)
          } else if (e instanceof AlreadyInProcessingException) {
            errors[BroadcastErrorStatus.ALREADY_IN_PROCESSING].push(id)
          } else if (e instanceof ContractNotFoundException) {
            errors[BroadcastErrorStatus.CONTRACT_NOT_FOUND].push(id)
          } else if (e instanceof NotReadyException) {
            notReady.push(id)
          } else {
            this.loggerService.error(`Unknown error: ${id} ${JSON.stringify(e)}`)
            errors[BroadcastErrorStatus.UNKNOWN].push(id)
          }
        }
      })
      await Promise.all(promises)

      if (notReady.length) {
        await this.txRepository.update({ id: In(notReady) }, {
          status: TxStatus.RETRY,
          updatedAt: new Date(),
        })
      }

      for (const key in errors) {
        let status: TxStatus = TxStatus.ERROR
        const ids = errors[key as keyof typeof errors]
        if (ids.length) {
          switch (key) {
            case BroadcastErrorStatus.ALREADY_IN_PROCESSING:
              status = TxStatus.PENDING
              break
            case BroadcastErrorStatus.ALREADY_IN_THE_STATE:
              status = TxStatus.SUCCESS
              break
            case BroadcastErrorStatus.INVALID_SIGNATURE:
              status = TxStatus.FAIL
              break
          }
          await this.txRepository.update({ id: In(ids) }, {
            status,
            updatedAt: new Date(),
            lastBroadcastErrorStatus: key as keyof typeof errors,
          })
        }
      }

    } else {
      if (!this.warningShown) {
        this.loggerService.warn('ALL NODES ARE BUSY. WAITING...')
        this.warningShown = true
      }
    }

    if (!processed) {
      await sleep(1000)
    }

    setImmediate(this.tick.bind(this))

  }

  async takeTxsToProcessing(chunkSize: number): Promise<we.ITransaction[]> {
    const txs = await this.txRepository.find({
      relations: ['body'],
      take: chunkSize,
      where: { status: In([TxStatus.NEW, TxStatus.RETRY]) },
      order: { 'createdAt': 'ASC' },
    })

    await this.txRepository.update({ id: In(txs.map((t) => t.id)) }, {
      status: TxStatus.PENDING,
    })

    return txs.map(this.mapTransaction.bind(this))
  }

  failMaxRebroadcastCount() {
    return this.txRepository.update({
      resendCounter: MoreThan(this.configService.getMaxRebroadcatNum()),
    }, {
      status: TxStatus.FAIL,
    })
  }

  async rebroadcastPending() {
    const query = 'UPDATE tx SET status = $1, resend_counter = resend_counter + 1 WHERE status = $2 AND modified < $3 RETURNING id'
    const res = await this.txRepository.query(query, [
      TxStatus.RETRY,
      TxStatus.PENDING,
      new Date(Date.now() - this.configService.getPendingTimeout()),
    ])
    if (res[1] > 0) {
      this.loggerService.warn(`Rebroadcasting ${res[1]} transactions`)
      res[0].map(({ id }: { id: string }) => {
        this.loggerService.verbose(`Rebroadcasting ${id}`)
      })
    }
  }

  async rebroadcastAll() {
    const res = await this.txRepository.update({
      status: In([TxStatus.FAIL, TxStatus.ERROR]),
    }, {
      status: TxStatus.RETRY,
      resendCounter: 0,
    })
    this.loggerService.warn(`Rebroadcasting ${res.affected} transactions`)
    return res.affected
  }

  async stat() {
    const query = 'SELECT status, last_broadcast_error_status, count(*) FROM tx GROUP BY status, last_broadcast_error_status'
    const res = await this.txRepository.query(query)
    if (res.length) {
      const all = res.reduce((acc: number, status: { count: number }) => acc + +status.count, 0)
      res.push({
        status: 'ALL',
        count: `${all}`,
      })
    }
    return res
  }

  mapTransaction(tx: Tx) {
    const grpcTx = new we.Transaction()

    const { version, senderPublicKey, timestamp, contractVersion, fee, proofs } = tx.body.body
    grpcTx.version = version

    const params = this.mapDataEntry(tx.body.body.params)

    const txParams = {
      contractId: bs58.decode(tx.contractId),
      senderPublicKey: bs58.decode(senderPublicKey),
      timestamp,
      fee,
      contractVersion,
      params,
    }

    grpcTx.callContractTransaction = new we.CallContractTransaction({
      ...txParams,
      id: bs58.decode(tx.id),
      proofs: proofs.map(bs58.decode),
    })

    return grpcTx
  }

  private mapDataEntry(params: any): we.DataEntry[] {
    return params.map(({ type, value, key }: any): we.IDataEntry => {
      switch (type) {
        case 'boolean':
          return { key, boolValue: value }
        case 'string':
          return { key, stringValue: value }
        case 'integer':
          return { key, intValue: value }
        case 'binary':
          return { key, binaryValue: decodeBase64(value) }
        default:
          throw new Error(`DataEntry mapping error: unknown type: ${type}`)
      }
    }).map((obj: any) => new we.DataEntry(obj))
  }

}
