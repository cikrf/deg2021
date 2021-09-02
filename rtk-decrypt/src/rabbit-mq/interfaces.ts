export type RabbitMQMessagePublisher = {
  publish(
    pattern: string,
    data: Record<string, unknown>,
    correlationId: string,
  ): void,
}

export type Decorators = {
  RabbitMQController: () => ClassDecorator,
  InjectAMQPChannelWrapper: ClassDecorator,
  RabbitRPC: (options?: { dto: any }) => MethodDecorator,
}

export type Message = {
  pattern: string,
  data: Record<string, any>,
  id: string,
}
