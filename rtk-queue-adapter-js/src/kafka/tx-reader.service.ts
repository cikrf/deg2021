import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { Kafka } from 'kafkajs'
import { ConfigService } from '../config/config.service'
import { LoggerService } from '../logger/logger.service'
import { Consumer } from '@nestjs/microservices/external/kafka.interface'
import { KAFKA_TOKEN, TX_REPOSITORY_TOKEN } from '../common.constants'
import { Tx } from '../entities/tx.entity'
import { Repository } from 'typeorm'
import { VoteValidationException } from '../common.exceptions'
import { TxBody } from '../entities/tx-body.entity'

@Injectable()
export class TxReaderService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly consumers: Consumer[] = []

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    @Inject(TX_REPOSITORY_TOKEN) private readonly txRepository: Repository<Tx>,
    @Inject(KAFKA_TOKEN) private readonly kafka: Kafka,
  ) {
    this.loggerService.setContext(TxReaderService.name)
  }

  async onApplicationBootstrap() {
    this.loggerService.warn('Initiating QUEUE consumers pool')
    const num = this.configService.getKafkaConsumers()

    for (let i = 0; i < num; i++) {
      const groupId = `${this.configService.getKafkaConsumerGroupVotes()}`
      const consumer = this.kafka.consumer({ groupId })
      await consumer.connect()
      await consumer.subscribe({
        topic: this.configService.getKafkaVoteTopic(),
        fromBeginning: this.configService.getKafkaFromBeginning(),
      })
      consumer.on(consumer.events.CONNECT, () => {
        this.loggerService.warn(`Consumer ${i} connected`)
      })
      consumer.on(consumer.events.CRASH, () => {
        this.loggerService.error('Kafka connection error. Restarting...')
        process.exit(1)
      })
      this.consumers.push(consumer)
    }
    return this.run()
  }

  validateVote(body: any): void {
    if (!body.id) {
      throw new VoteValidationException('Id is undefined')
    }
  }

  run() {
    this.consumers.map((consumer) => {
      consumer.run({
        eachBatchAutoResolve: true,
        partitionsConsumedConcurrently: this.configService.getKafkaConcurrency(),
        eachBatch: async ({
          batch,
        }) => {
          const txs: Tx[] = []
          batch.messages.map((message) => {
            if (message.value) {
              try {
                const body = JSON.parse(message.value.toString())

                this.validateVote(body)

                const txBody = new TxBody()
                txBody.body = body

                const tx = this.txRepository.create({
                  id: body.id,
                  contractId: body.contractId,
                  body: txBody,
                })
                txs.push(tx)

              } catch (e) {
                if (e instanceof TypeError) {
                  this.loggerService.error(`Could not parse value #${batch.partition}/${message.offset}`)
                } else if (e instanceof VoteValidationException) {
                  this.loggerService.error(`Validation failed #${batch.partition}/${message.offset}: ${e.message}`)
                } else {
                  this.loggerService.error(`Unknown exception #${batch.partition}/${message.offset}: ${e.message}`)
                }
              }
            } else {
              this.loggerService.debug(message)
            }
          })

          try {
            await this.txRepository.save(txs, { chunk: 200 })
          } catch (e) {
            this.loggerService.error(e)
          }
        },
      })
    })
  }

  onApplicationShutdown() {
    if (this.consumers) {
      this.loggerService.warn('Disconnecting TX-READER consumers')
      this.consumers.map(async (consumer) => {
        await consumer.disconnect()
      })
    }
  }

}
