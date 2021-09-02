import { Inject, Injectable } from '@nestjs/common'
import { ChannelWrapper } from 'amqp-connection-manager'
import { RABBIT_MQ_PUBLISHER_CONFIG_TOKEN } from '../common.constants'
import { RabbitMQConfig } from '../types/general'
import { InjectAMQPChannelWrapper } from './decorators'
import { RabbitMQMessagePublisher } from './interfaces'

@InjectAMQPChannelWrapper
@Injectable()
export class RabbitMQClient implements RabbitMQMessagePublisher {
  private readonly channelWrapper: ChannelWrapper

  constructor(
    @Inject(RABBIT_MQ_PUBLISHER_CONFIG_TOKEN) private readonly rabbitMQPublisherConfig: RabbitMQConfig,
  ) {}

  async publish(
    pattern: string,
    data: Record<string, unknown>,
    correlationId: string,
  ) {
    const { exchange, outcomingQueue } = this.rabbitMQPublisherConfig
    const content = Buffer.from(JSON.stringify({
      pattern,
      data,
      id: correlationId,
    }))
    await this.channelWrapper.publish(exchange, outcomingQueue, content)
  }
}
