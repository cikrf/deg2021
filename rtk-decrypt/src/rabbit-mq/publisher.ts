import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import { RabbitMQConfig } from '../types/general'

export function createPublisher(
  amqpConnectionManager: AmqpConnectionManager,
  config: RabbitMQConfig,
) {
  const { exchange, outcomingQueue } = config
  const channelWrapper: ChannelWrapper = amqpConnectionManager.createChannel()
  channelWrapper.addSetup(async (channel: ConfirmChannel) => {
    await channel.assertExchange(exchange, 'topic')
    await channel.assertQueue(outcomingQueue, {
      durable: false,
      autoDelete: false,
    })
    await channel.bindQueue(outcomingQueue, exchange, outcomingQueue)
  })
  return channelWrapper
}
