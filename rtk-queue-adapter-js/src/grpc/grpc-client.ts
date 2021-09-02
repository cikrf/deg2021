import * as loader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { GRPC_OPTIONS, GRPC_RECONNECT_TIMEOUT, MAX_GRPC_CONNECTION_TRIES } from '../common.constants'
import { wavesenterprise, wavesenterprise as we } from './proto/root'
import { LoggerService } from '../logger/logger.service'
import { sleep } from '../utils/sleep'
import { GrpcClientStatus, NodeConfig } from '../types/grpc'
import {
  AlreadyInProcessingException,
  AlreadyInStateException,
  ContractNotFoundException,
  InvalidPublicKeyException,
  InvalidSignatureException,
  UnknownErrorException,
} from '../common.exceptions'
import UtxSize = wavesenterprise.grpc.UtxSize

export class GrpcClient {
  private iteration: number = 0
  private metadata = new grpc.Metadata()
  private api: any
  private config: we.NodeConfigResponse
  private transactionPublicService: we.grpc.TransactionPublicService
  private _status: GrpcClientStatus = GrpcClientStatus.disconnected
  private _statusModified: Date = new Date(0)
  private _lastUtxSize: number = 0
  private utxInfo: grpc.ClientReadableStream<UtxSize>

  constructor(
    private readonly loggerService: LoggerService,
    private readonly options: {
      idx: string | number,
      connectionId: string,
      address: string,
      utxLimit: number,
      auth?: { key: string, value: string },
      unbanTimeout: number,
    },
  ) {

    const { connectionId, auth } = this.options

    if (auth) {
      this.metadata.add(auth.key, auth.value)
    }

    this.metadata.set('connection-id', connectionId)

    const packageDefinition = loader.loadSync(
      [
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
    this.unbanScheduler()
  }

  unbanScheduler() {
    const { unbanTimeout, address, idx } = this.options
    const statusesToUnban = [GrpcClientStatus.banned, GrpcClientStatus.disconnected]
    if (statusesToUnban.includes(this.status) && this.statusModified < new Date(Date.now() - unbanTimeout)) {
      this.loggerService.warn(`Node ${idx} trying to unban... Address: '${address}'`)
      this.reset()
      this.updateStatus(GrpcClientStatus.connecting)
      this.connect()
    }
    setTimeout(this.unbanScheduler.bind(this), 1000)
  }

  async connect(): Promise<any> {
    if (this.iteration) { await sleep(GRPC_RECONNECT_TIMEOUT) }

    const { idx, address, utxLimit } = this.options

    const defaultOptions = [address, grpc.credentials.createInsecure(), GRPC_OPTIONS]
    this.loggerService.log(`Node ${idx} trying to connect... Address: '${address}'`)

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

      this.transactionPublicService = new this.api.wavesenterprise.grpc.TransactionPublicService(...defaultOptions)

      // @ts-ignore
      this.utxInfo = await this.transactionPublicService.utxInfo({}, this.metadata)

      this.utxInfo.on('data', (data: { size: number }) => {
        const size = data.size || 0
        this._lastUtxSize = size
        this.loggerService.debug(`Node-${idx} size: ${size} overflow: ${size > utxLimit}`)
        if (size > utxLimit && this.status === GrpcClientStatus.ready) {
          this.updateStatus(GrpcClientStatus.utxFull)
        } else if (size < utxLimit && this.status === GrpcClientStatus.utxFull) {
          this.updateStatus(GrpcClientStatus.ready)
        }
      })
      this.utxInfo.on('error', this.receiveError.bind(this))
      this.utxInfo.on('close', () => {
        this.updateStatus(GrpcClientStatus.disconnected)
      })

      this.updateStatus(GrpcClientStatus.ready)
      return Promise.resolve()

    } catch (e) {
      this.loggerService.error(e.message, e.stackTrace)
    }
    this.iteration++

    if (MAX_GRPC_CONNECTION_TRIES < this.iteration) {
      this.updateStatus(GrpcClientStatus.banned)
      return false
    }

    if (this._status !== GrpcClientStatus.ready) {
      return this.connect()
    }
  }

  disconnect() {
    if (this.utxInfo) {
      this.utxInfo.cancel()
    }
  }

  get utxSize() {
    return this._lastUtxSize
  }

  get utxLeft() {
    return this.options.utxLimit - this.utxSize
  }

  get status() {
    return this._status
  }

  get statusModified() {
    return this._statusModified
  }

  receiveError(e?: Error & { code: number, metadata?: grpc.Metadata }) {
    if (e instanceof Error) {
      if (e.code === 1) {
        this.loggerService.warn(e.message)
      } else {
        this.loggerService.error(`Error received: ${e.message} ${e.metadata && e.metadata.get('error-message')}`)
      }
    } else {
      this.loggerService.error('Unknown error received')
      process.exit(1)
    }
  }

  updateStatus(status: GrpcClientStatus) {
    this.loggerService.warn(`Node ${this.options.idx} status changed to ${status}`)
    this._status = status
    this._statusModified = new Date()
  }

  reset() {
    this.iteration = 0
  }

  broadcast(tx: we.ITransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transactionPublicService.broadcast(tx, (err: any) => {
        if (err) {
          const code = +err.metadata.get('error-code')
          const message = `${code}: ${err.metadata.get('error-message').join(', ')}`
          switch (code) {
            case 108:
              return reject(new InvalidPublicKeyException(message))
            case 199:
              return reject(new AlreadyInProcessingException(message))
            case 112:
              if (message.includes('validate as signature')) {
                return reject(new InvalidSignatureException(message))
              } else if (message.includes('already in the state')) {
                return reject(new AlreadyInStateException(message))
              } else {
                return reject(new UnknownErrorException(message))
              }
            case 600:
              return reject(new ContractNotFoundException(message))
            default:
              return reject(new UnknownErrorException(err))
          }
        }

        this._lastUtxSize++

        resolve()
      })
    })
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
