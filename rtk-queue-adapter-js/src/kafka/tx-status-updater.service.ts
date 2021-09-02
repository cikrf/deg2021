import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { Kafka } from 'kafkajs'
import { ConfigService } from '../config/config.service'
import { LoggerService } from '../logger/logger.service'
import { Consumer } from '@nestjs/microservices/external/kafka.interface'
import { DB_CONNECTION_TOKEN, KAFKA_TOKEN, TX_REPOSITORY_TOKEN } from '../common.constants'
import { Tx, TxStatus } from '../entities/tx.entity'
import { Connection, In, QueryRunner, Repository } from 'typeorm'
import * as BN from 'bn.js'
import * as bs58 from 'bs58'

@Injectable()
export class TxStatusUpdaterService implements OnApplicationBootstrap, OnApplicationShutdown {
  private consumer: Consumer

  private qr: QueryRunner

  queue = Promise.resolve()

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    @Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection,
    @Inject(TX_REPOSITORY_TOKEN) private readonly txRepository: Repository<Tx>,
    @Inject(KAFKA_TOKEN) private readonly kafka: Kafka,
  ) {
    this.qr = this.connection.createQueryRunner()
    this.loggerService.setContext(TxStatusUpdaterService.name)
  }

  async onApplicationBootstrap() {
    this.loggerService.warn('Initiating BLOCKCHAIN consumer')
    const groupId = `${this.configService.getKafkaConsumerGroupBlockchain()}`
    this.consumer = this.kafka.consumer({ groupId })
    await this.consumer.connect()
    await this.consumer.subscribe({
      topic: this.configService.getKafkaBlockchainTopic(),
      fromBeginning: this.configService.getKafkaFromBeginning(),
    })
    this.consumer.on(this.consumer.events.CONNECT, () => {
      this.loggerService.warn('Consumer txUpdater connected')
    })
    this.consumer.on(this.consumer.events.CRASH, () => {
      this.loggerService.error('Kafka connection error. Restarting...')
      process.exit(1)
    })
    return this.run()
  }

  async run() {
    await this.consumer.run({
      eachBatchAutoResolve: true,
      partitionsConsumedConcurrently: this.configService.getKafkaConcurrency(),
      eachBatch: async ({
        batch,
      }) => {
        const statusUpdates: { [TxStatus.SUCCESS]: string[], [TxStatus.PENDING]: string[] } = {
          [TxStatus.SUCCESS]: [],
          [TxStatus.PENDING]: [],
        }

        batch.messages.map((message) => {
          if (message.headers?.event?.toString() === 'transaction') {
            if (message.headers.nestedTxId) {
              const hex = message.headers.nestedTxId!.toString()
              const bytes = new BN(hex, 16).toBuffer('be', 32)
              const id = bs58.encode(bytes)

              this.loggerService.verbose(`Received from kloader ${id}`)

              statusUpdates[TxStatus.SUCCESS].push(id)
            } else if (message.headers.txId) {
              this.loggerService.warn(`${message.headers.txId} tx have no nested tx id`)
            } else {
              this.loggerService.warn(`${message.headers.index} has no txId`)
            }
          } else if (message.headers?.event?.toString() === 'rollback') {
            const hex = message.headers.txId!.toString()
            const bytes = new BN(hex, 16).toBuffer('be', 32)
            const id = bs58.encode(bytes)

            this.loggerService.verbose(`Rollbacked tx ${id}`)
            statusUpdates[TxStatus.PENDING].push(id)
          } else {
            this.loggerService.error(`Unknown message ${batch.partition}/${message.offset} `)
          }
        })

        await this.queued(async () => {
          try {
            await this.qr.startTransaction()

            for (const key in statusUpdates) {
              const ids = statusUpdates[key as keyof typeof statusUpdates]
              if (ids.length) {
                await this.txRepository.update({ id: In(ids) }, {
                  status: key as TxStatus,
                  updatedAt: new Date(),
                })
              }
            }
            await this.qr.commitTransaction()
          } catch (e) {
            this.loggerService.error(e)
            await this.qr.rollbackTransaction()
          }

        })

      },
    })

  }

  queued(fn: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const res = await fn()
          resolve(res)
        } catch (e) {
          this.loggerService.error(`Queue error: ${e.message}`)
          reject(e)
        }
      })
    })
  }

  async onApplicationShutdown() {
    this.loggerService.warn('Disconnecting BLOCKCHAIN consumer')
    await this.consumer.disconnect()
  }

}
