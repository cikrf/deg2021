import { HttpException, Logger } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel, ConsumeMessage } from 'amqplib'
import PQueue from 'p-queue'
import { ConfigService } from 'src/config/config.service'
import { LoggerService } from 'src/logger/logger.service'
import { RabbitMQConfig } from '../types/general'
import { Message } from './interfaces'
import { ValidationException } from './validation.exception'

async function createConsumer(amqpConnectionManager: AmqpConnectionManager, config: RabbitMQConfig) {
  let channel!: ConfirmChannel
  const channelWrapper: ChannelWrapper = amqpConnectionManager.createChannel()
  await channelWrapper.addSetup((confirmChannel: ConfirmChannel) => {
    channel = confirmChannel
  })
  await channelWrapper.waitForConnect()
  const { exchange, incomingQueue } = config
  await channel.assertExchange(exchange, 'topic')
  await channel.assertQueue(incomingQueue, {
    durable: false,
    autoDelete: false,
  })
  await channel.bindQueue(incomingQueue, exchange, incomingQueue)
  return channel
}

async function processMessage(
  { id, data, pattern }: Message,
  publish: (pattern: string, data: Record<string, unknown>, correlationId: string) => Promise<void>,
  controllerInstance: Record<string, any>,
): Promise<void> {
  try {
    const response = await controllerInstance[pattern](data)
    await publish(pattern, response, id || data.pollId || '')
  } catch (e) {
    if (e instanceof HttpException) {
      Logger.error(e.message, '', 'RabbitMQController')
      await publish(
        'error',
        e.getResponse() as Record<string, unknown>,
        id,
      )
    } else if (e instanceof ValidationException) {
      Logger.error(e.message, '', 'RabbitMQController')
      await publish(
        'error',
        {
          message: e.message,
          errorCode: 'VALIDATION_ERROR',
        },
        id,
      )
    }
  }
}

export async function runConsumer(
  amqpConnectionManager: AmqpConnectionManager,
  config: RabbitMQConfig,
  publish: (pattern: string, data: Record<string, unknown>, correlationId: string) => Promise<void>,
  controllerInstance: Record<string, any>,
  configService: ConfigService,
  loggerService: LoggerService,
) {
  const bind = async () => {
    const { incomingQueue, asyncSlotsCount } = config
    loggerService.log('connection established', 'RabbitMQController')
    const consumer = await createConsumer(amqpConnectionManager, config)
    const queue = new PQueue({
      concurrency: asyncSlotsCount,
      autoStart: true,
    })
    if (configService.getLogLevel().includes('debug')) {
      queue.on('next', () => {
        loggerService.debug(`Task is completed. Queue size: ${queue.size}. Pending tasks count: ${queue.pending}.`, 'RabbitMqConsumer')
      })
      queue.on('add', () => {
        loggerService.debug(`Task is added. Queue size: ${queue.size}. Pending tasks count: ${queue.pending}.`, 'RabbitMqConsumer')
      })
    }
    consumer.consume(incomingQueue, async (msg: ConsumeMessage | null) => {
      if (msg === null) {
        return
      }
      const message: Message = JSON.parse(msg.content.toString())
      const { pattern, data, id } = message;
      await queue.add(() => processMessage(message, publish, controllerInstance))
      consumer.ack(msg)
      Logger.log(
        'RabbitMQ RPC,\n' +
        `Receive message with pattern: "${pattern}",\n` +
        `containing data: ${JSON.stringify(data, null, 2)},\n` +
        `correlation id: ${id}`,
        'RabbitMQController',
      )
    }, { noAck: false })
  }
  bind()
  amqpConnectionManager.on('connect', bind)
  amqpConnectionManager.on('disconnect', async () => {
    loggerService.log('connection lost', 'RabbitMQController')
  })
}
