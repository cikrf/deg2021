import { OnApplicationBootstrap } from '@nestjs/common'
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { RabbitMQConfig } from '../types/general'
import { runConsumer } from './consumer'
import { RabbitMQMessagePublisher } from './interfaces'
import { createPublisher } from './publisher'
import { ValidationException } from './validation.exception'

export function createDecorators(config: RabbitMQConfig) {
  const amqpConnectionManager: AmqpConnectionManager = connect(
    [config.uri],
    {
      heartbeatIntervalInSeconds: 5,
    }
  )
  const publisher = createPublisher(amqpConnectionManager, config)
  return {
    RabbitMQController: () => {
      return (ctr: new (...args: any[]) => any) => {
        return class extends ctr implements OnApplicationBootstrap, RabbitMQMessagePublisher {
          onApplicationBootstrap() {
            this.init()
          }

          async init() {
            await runConsumer(amqpConnectionManager, config, this.publish, this, this.configService, this.loggerService)
          }

          async publish(pattern: string, data: Record<string, unknown>, correlationId: string) {
            const { exchange, outcomingQueue } = config
            const content = Buffer.from(JSON.stringify({
              pattern,
              data,
              id: correlationId,
            }))
            await publisher.publish(exchange, outcomingQueue, content)
          }
        }
      }
    },
    InjectAMQPChannelWrapper: (constructor: new (...args: any[]) => any) => {
      return class extends constructor {
        readonly channelWrapper: ChannelWrapper = publisher
      }
    },
    RabbitRPC(options?: { dto: any }) {
      return function (
        _target: any,
        _propertyName: string,
        descriptor: TypedPropertyDescriptor<any>,
      ) {
        const method = descriptor.value!
        descriptor.value = new Proxy(method, {
          apply: async (target: any, thisArg: any, argArray: any) => {
            if (options !== undefined) {
              const errors = await validate(plainToClass(options.dto, argArray[0]))
              if (errors.length > 0) {
                throw new ValidationException(errors.map(error => Object.values(error.constraints!)).flat().join(', '))
              }
            }
            return target.apply(thisArg, argArray)
          },
        })
        return descriptor
      }
    },
  }
}
