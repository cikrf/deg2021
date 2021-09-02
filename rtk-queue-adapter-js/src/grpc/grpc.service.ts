import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { LoggerService } from '../logger/logger.service'
import { GrpcClient } from './grpc-client'
import { GrpcClientStatus } from '../types/grpc'
import { wavesenterprise as we } from '../grpc/proto/root'
import { NotReadyException } from '../common.exceptions'

@Injectable()
export class GrpcService implements OnApplicationBootstrap, OnApplicationShutdown {

  private clients: GrpcClient[]

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(GrpcService.name)
  }

  async onApplicationBootstrap() {
    const nodes = this.configService.getNodesConfig()
    const connectionId = this.configService.getServiceName()
    const utxLimit = this.configService.getUtxLimit()
    const unbanTimeout = this.configService.getNodeBanTimeout()
    this.clients = nodes.map(({ address, apiKey }, idx) =>
      new GrpcClient(this.loggerService, {
        idx,
        connectionId,
        address,
        utxLimit,
        auth: {
          key: 'api-key',
          value: apiKey,
        },
        unbanTimeout,
      }),
    )
    await Promise.all(this.clients.map((client) => client.connect()))
    const connected = this.clients.filter((client) => client.status === GrpcClientStatus.ready)
    if (!connected.length) {
      this.loggerService.error('No nodes are ready')
      process.exit(1)
    }
  }

  readyClients() {
    return this.clients?.filter((client) => client.status === GrpcClientStatus.ready) || []
  }

  utxLeft() {
    return this.readyClients().reduce((acc, client) => acc + client.utxLeft, 0)
  }

  broadcast(tx: we.ITransaction) {
    const ready = this.readyClients()
    const client = ready.sort((a, b) => b.utxLeft - a.utxLeft).shift()
    if (!client) {
      throw new NotReadyException()
    }
    return client.broadcast(tx)
  }

  onApplicationShutdown() {
    this.loggerService.warn('Closing GRPC connections')
    this.clients
      .filter((client) => [GrpcClientStatus.ready, GrpcClientStatus.utxFull].includes(client.status))
      .map((client) => client.disconnect())
  }

}
