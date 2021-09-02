import { setConfig } from '../utils/set-config'
import { createDecorators } from './create-decorators'
import { Decorators } from './interfaces'

setConfig()

export const { RabbitMQController, InjectAMQPChannelWrapper, RabbitRPC } = createDecorators({
  uri: process.env.RABBIT_MQ_URI!,
  outcomingQueue: process.env.RABBIT_MQ_OUTCOMING_QUEUE!,
  incomingQueue: process.env.RABBIT_MQ_INCOMING_QUEUE!,
  exchange: process.env.RABBIT_MQ_EXCHANGE!,
  asyncSlotsCount: process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT !== undefined ? parseInt(process.env.RABBIT_MQ_ASYNC_SLOTS_COUNT, 10) : 10,
}) as Decorators
