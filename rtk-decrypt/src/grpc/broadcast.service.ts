import { Inject, Injectable } from '@nestjs/common'
import { GRPC_CLIENT, TX_103, TX_104 } from '../common.constants'
import { ContractParam, DataType, GrpcClient, Operation, TxTypes } from './types'
import { wavesenterprise as we } from './proto/root'
import { LoggerService } from '../logger/logger.service'
import { CreatePollRequestDTO } from '../master/dto/create-poll-req.dto'
import { NodeConfig } from '../types/general'
import { ConfigService } from '../config/config.service'
import { parseGrpcError } from '../utils/parse-grpc-error'
import { getDateString, isDateInstance } from '../utils/date-utils'
import { concatUint8Arrays, hexToBytes, intToBytes, longToBytes } from '../utils/byte-utils'
import { Decryption, KeyPairAndDecryption } from '../crypto/types'
import { gostId, gostSign } from '../utils/gost-utils'


@Injectable()
export class BroadcastService {

  private readonly contractName = 'voting-contract'
  private readonly nodeConfig: NodeConfig
  private readonly keyPair: { publicKey: Uint8Array, privateKey: Uint8Array }

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    @Inject(GRPC_CLIENT) private readonly grpcClient: GrpcClient,
  ) {
    this.loggerService.setContext(BroadcastService.name)
    this.nodeConfig = this.grpcClient.nodeConfig
    this.keyPair = {
      privateKey: this.configService.getPrivateKey(),
      publicKey: this.configService.getPublicKey(),
    }
  }

  broadcast(tx: we.ITransaction): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      this.loggerService.debug(`Tx broadcast. Body: ${JSON.stringify(tx, null, 2)}`)
      this.grpcClient.transactionService.broadcast(tx, (err) => {
        if (err) {
          return reject(new Error(parseGrpcError(err)))
        }
        const txId = gostId(this.getBytes(tx))
        resolve(txId)
      })
    })
  }

  createTx(params: ContractParam) {
    const contractParams = this.mapDataEntry(params)

    const tx = new we.Transaction()
    tx.version = 3

    const timestamp = Date.now()

    const txParams = {
      image: this.configService.getContractImage(),
      imageHash: this.configService.getContractImageHash(),
      contractName: this.contractName,
      senderPublicKey: this.keyPair.publicKey,
      fee: this.nodeConfig.minimumFee[TX_103],
      timestamp: timestamp ?? Date.now(),
      params: contractParams,
      feeAssetId: null,
      atomicBadge: null,
    }

    tx.createContractTransaction = new we.CreateContractTransaction({
      ...txParams,
    })

    tx.createContractTransaction.proofs = [this.signature(this.getBytes(tx))]

    return tx
  }

  callTx(contractId: Uint8Array, params: ContractParam) {
    const contractParams = this.mapDataEntry(params)

    const tx = new we.Transaction()
    tx.version = 4

    const timestamp = Date.now()

    const txParams = {
      contractId,
      senderPublicKey: this.keyPair.publicKey,
      timestamp,
      fee: this.nodeConfig.minimumFee[TX_104],
      contractVersion: 1,
      params: contractParams,
      feeAssetId: null,
      atomicBadge: null,
    }

    tx.callContractTransaction = new we.CallContractTransaction({
      ...txParams,
    })

    const bytes = this.getBytes(tx)
    tx.callContractTransaction.proofs = [this.signature(bytes)]


    return tx
  }

  async createPoll(request: CreatePollRequestDTO): Promise<Uint8Array> {
    const servers = this.configService.getMasterKeys()
    const contractParams = {
      ...request,
      blindSigModulo: hexToBytes(request.blindSigModulo),
      blindSigExponent: hexToBytes(request.blindSigExponent),
      dimension: JSON.stringify(request.dimension),
      votersListRegistrator: request.votersListRegistrator,
      blindSigIssueRegistrator: request.blindSigIssueRegistrator,
      issueBallotsRegistrator: request.issueBallotsRegistrator,
      servers,
    }
    const tx = await this.createTx(contractParams)
    return this.broadcast(tx)
  }

  async addMainKey(
    contractId: Uint8Array,
    mainKey: string,
    dkgKey: string,
    commissionKey: string,
  ): Promise<Uint8Array> {
    const contractParams = {
      operation: Operation.addMainKey,
      mainKey,
      commissionKey,
      dkgKey,
    }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  async startVoting(contractId: Uint8Array): Promise<Uint8Array> {
    const contractParams = { operation: Operation.startVoting }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  async finishVoting(contractId: Uint8Array): Promise<Uint8Array> {
    const contractParams = { operation: Operation.finishVoting }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  async decryption(contractId: Uint8Array, decryption: Decryption[][]): Promise<Uint8Array> {
    const contractParams = {
      operation: Operation.decryption,
      decryption: JSON.stringify(this.mapDecryption(decryption)),
    }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  async commissionDecryption(
    contractId: Uint8Array,
    { decryption, privateKey }: KeyPairAndDecryption,
  ): Promise<Uint8Array> {
    const contractParams = {
      operation: Operation.commissionDecryption,
      decryption: JSON.stringify(this.mapDecryption(decryption)),
      commissionSecretKey: Buffer.from(privateKey).toString('hex'),
    }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  async results(contractId: Uint8Array, results: number[][]): Promise<Uint8Array> {
    const contractParams = {
      operation: Operation.results,
      results: JSON.stringify(results),
    }
    const tx = await this.callTx(contractId, contractParams)
    return this.broadcast(tx)
  }

  private getBytes(tx: we.ITransaction): Uint8Array {
    const type = tx.createContractTransaction
      ? TxTypes.createContract
      : TxTypes.callContract

    const body: any = tx.createContractTransaction || tx.callContractTransaction

    const feeAssetId = body.feeAssetId
    const atomicBadge = body.atomicBadge
    const fee = longToBytes(0)

    const timestamp = longToBytes(+body.timestamp).splice(2)
    const paramsBytes = Uint8Array.from([...intToBytes(body.params.length), ...this.paramsBytes(body.params)])

    let bytes
    switch (type) {
      case TxTypes.createContract:
        const image = Uint8Array.from([0, Buffer.from(body.image).length, ...Buffer.from(body.image)])
        const imageHash = Uint8Array.from([0, Buffer.from(body.imageHash).length, ...Buffer.from(body.imageHash)])
        // eslint-disable-next-line max-len
        const contractName = Uint8Array.from([0, Buffer.from(body.contractName).length, ...Buffer.from(body.contractName)])
        bytes = Uint8Array.from([
          103, tx.version,
          ...body.senderPublicKey,
          ...image,
          ...imageHash,
          ...contractName,
          ...paramsBytes,
          0, 0,
          ...fee,
          ...timestamp,
          feeAssetId,
          atomicBadge,
        ])
        break
      case TxTypes.callContract:
        const contractId = Uint8Array.from([0, Buffer.from(body.contractId).length, ...Buffer.from(body.contractId)])
        const contractVersion = intToBytes(body.contractVersion, 4)
        bytes = Uint8Array.from([
          104, tx.version,
          ...body.senderPublicKey,
          ...contractId,
          ...paramsBytes,
          0, 0,
          ...fee,
          ...timestamp,
          ...contractVersion,
          feeAssetId,
          atomicBadge,
        ])
        break
    }

    return bytes
  }

  private signature(bytes: Uint8Array): Uint8Array {
    return new Uint8Array(gostSign(this.keyPair.privateKey, bytes))
  }

  private paramsBytes(contractParams: we.DataEntry[]): Uint8Array {
    const mapped = contractParams.map((entry) => {
      const { key, value } = entry
      let valBytes
      switch (entry.value) {
        case 'intValue':
          valBytes = Uint8Array.from([DataType.INTEGER, ...longToBytes(+entry.intValue!)])
          break
        case 'boolValue':
          valBytes = Uint8Array.from([DataType.BOOLEAN, value ? 1 : 0])
          break
        case 'binaryValue':
          const binLen = intToBytes(entry.binaryValue!.length, 4, 65536)
          valBytes = Uint8Array.from([DataType.BINARY, ...binLen, ...entry.binaryValue!])
          break
        case 'stringValue':
          const strLen = intToBytes(Buffer.from(entry.stringValue!).length, 4, 65536)
          valBytes = Uint8Array.from([DataType.STRING, ...strLen, ...Buffer.from(entry.stringValue!)])
          break
        default:
          throw new Error(`There is no data type "${entry.value}"`)
      }
      return Uint8Array.from([
        0,
        Buffer.from(key).length,
        ...Buffer.from(key),
        ...valBytes,
      ])
    })
    return mapped.length > 1 ? concatUint8Arrays(...mapped) : mapped[0]
  }

  private mapDataEntry(params: any): we.DataEntry[] {
    const entries = Object.entries(params) as any[]
    return entries.map(([key, value]): we.IDataEntry => {
      switch (typeof value) {
        case 'boolean':
          return { key, boolValue: value }
        case 'string':
          return { key, stringValue: value }
        case 'number':
          return { key, intValue: value }
        case 'object':
          if (params[key].constructor === Uint8Array || Buffer.isBuffer(params[key])) {
            return { key, binaryValue: value }
          } else if (isDateInstance(value)) {
            return { key, stringValue: getDateString(value) }
          } else {
            return { key, stringValue: JSON.stringify(value) }
          }
        default:
          throw new Error('Map data entry error')
      }
    }).map((obj) => new we.DataEntry(obj))
  }

  private mapDecryption(decryption: Decryption[][]) {
    return decryption.map((question) => {
      return question.map((option) => {
        return {
          P: Buffer.from(option.P).toString('hex'),
          w: Buffer.from(option.w).toString('hex'),
          U1: Buffer.from(option.U1).toString('hex'),
          U2: Buffer.from(option.U2).toString('hex'),
        }
      })
    })
  }

}
