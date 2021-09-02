import * as loader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { ConfigService } from '../config/config.service'
import { GRPC_CLIENT, GRPC_OPTIONS, GRPC_RECONNECT_TIMEOUT, MAX_GRPC_CONNECTION_TRIES } from '../common.constants'
import { wavesenterprise as we } from './proto/root'
import { AUTH_MODE, AuthService } from '../auth/auth.service'
import { LoggerService } from '../logger/logger.service'
import { NodeConfig } from '../types/general'
import { sleep } from '../utils/sleep'


class GrpcClient {
  private iteration: number = 0
  private metadata = new grpc.Metadata()
  private api: any
  private config: we.NodeConfigResponse
  private blockchainEventsService: we.BlockchainEventsService
  private contractStatusService: we.ContractStatusService
  private transactionPublicService: we.grpc.TransactionPublicService
  private connected: boolean = false

  constructor(
    private readonly loggerService: LoggerService,
    private readonly addresses: string[],
    private readonly connectionId: string,
    private readonly auth?: { key: string, value: string },
  ) {
    if (this.auth) {
      this.metadata.add(this.auth.key, this.auth.value)
    }

    this.metadata.set('connection-id', this.connectionId)

    const packageDefinition = loader.loadSync(
      [
        `${__dirname}/proto/messagebroker/messagebroker_blockchain_events_service.proto`,
        `${__dirname}/proto/util/util_contract_status_service.proto`,
        `${__dirname}/proto/util/util_node_info_service.proto`,
        `${__dirname}/proto/transaction/transaction_public_service.proto`,
      ],
      {
        enums: String,
        longs: String,
        bytes: Buffer,
        includeDirs: [
          `${__dirname}/proto`,
        ],
      })

    this.api = grpc.loadPackageDefinition(packageDefinition)
  }

  async connect(): Promise<any> {
    if (this.iteration) { await sleep(GRPC_RECONNECT_TIMEOUT) }

    const address = this.addresses[this.iteration % this.addresses.length]

    const defaultOptions = [address, grpc.credentials.createInsecure(), GRPC_OPTIONS]
    this.loggerService.log(`Trying to connect '${address}'`, 'GrpcClient')

    try {
      const nodeInfoService = new this.api.wavesenterprise.NodeInfoService(...defaultOptions)
      this.config = await new Promise((resolve, reject) => {
        nodeInfoService.NodeConfig({}, this.metadata, (err: Error | null, config: we.NodeConfigResponse) => {
          if (err) {
            reject(err)
          }
          resolve(config)
        })
      })

      this.blockchainEventsService = new this.api.wavesenterprise.BlockchainEventsService(...defaultOptions)
      this.contractStatusService = new this.api.wavesenterprise.ContractStatusService(...defaultOptions)
      this.transactionPublicService = new this.api.wavesenterprise.grpc.TransactionPublicService(...defaultOptions)

      this.connected = true
      this.loggerService.log(`Connected to ${address}`, 'GrpcClient')
      return Promise.resolve()

    } catch (e) {
      this.loggerService.error(e.message, e.stackTrace, 'GrpcClient')
    }
    this.iteration++

    if (MAX_GRPC_CONNECTION_TRIES < this.iteration) {
      this.loggerService.error('Max connection tries reached', '', 'GrpcClient')
      process.exit(1)
    }

    if (!this.connected) {
      return this.connect()
    }
  }

  async reconnect(wait: boolean = false) {
    if (wait) {
      await sleep(GRPC_RECONNECT_TIMEOUT)
    }
    this.connected = false
    this.reset()
    return this.connect()
  }

  reset() {
    this.iteration = 0
  }

  get eventsService(): we.BlockchainEventsService {
    return this.blockchainEventsService
  }

  get statusService(): we.ContractStatusService {
    return this.contractStatusService
  }

  get transactionService(): we.grpc.TransactionPublicService {
    return this.transactionPublicService
  }

  get nodeConfig(): NodeConfig {
    const minimumFee = Object.keys(this.config.minimumFee)
      .reduce((acc: any, key) => ({ ...acc, [key]: +this.config.minimumFee[key] }), {})

    const additionalFee = Object.keys(this.config.additionalFee)
      .reduce((acc: any, key) => ({ ...acc, [key]: +this.config.additionalFee[key] }), {})

    return {
      chainId: this.config.chainId,
      additionalFee,
      gostCrypto: this.config.cryptoType.toString() === 'GOST',
      minimumFee,
    }
  }
}


export const GrpcProvider = {
  provide: GRPC_CLIENT,
  useFactory: async (
    configService: ConfigService,
    authService: AuthService,
    loggerService: LoggerService,
  ) => {
    let auth
    switch (authService.getMode()) {
      case AUTH_MODE.API_KEY:
        auth = {
          key: 'X-API-Key',
          value: authService.getApiKey(),
        }
        break
      case AUTH_MODE.JWT:
        const { access_token } = await authService.getTokens()
        auth = { key: 'authorization', value: `bearer ${access_token}` }
        break
    }

    const addresses = configService.getGrpcAddresses()
    const connectionId = configService.getServiceName()

    const grpcClient = new GrpcClient(loggerService, addresses, connectionId, auth)
    await grpcClient.connect()

    return grpcClient
  },
  inject: [ConfigService, AuthService, LoggerService],
}
