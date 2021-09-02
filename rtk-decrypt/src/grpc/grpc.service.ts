import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { sleep } from '../utils/sleep'
import { GRPC_CLIENT, MAX_DEAD_GRPC_WARNINGS, TX_POOL_TTL } from '../common.constants'
import { ConfigService } from '../config/config.service'
import { wavesenterprise as we } from './proto/root'
import { FinalTx, GrpcClient, LiquidTx, TxStatus } from './types'
import { ClientReadableStream, Metadata } from '@grpc/grpc-js'
import { InjectEventEmitter } from 'nest-emitter'
import { EventBus } from '../types/event-bus'
import { Block } from '../entities/block.entity'
import { Tx, VotingOperation } from '../entities/tx.entity'
import { LoggerService } from '../logger/logger.service'
import { fromHex } from '../crypto/utils'
import { parseGrpcError } from '../utils/parse-grpc-error'


@Injectable()
export class GrpcService implements OnApplicationBootstrap, OnApplicationShutdown {

  private eventsStream: ClientReadableStream<we.BlockchainEvent>

  private liquidTxs: Map<string, LiquidTx> = new Map()
  private finalTxs: Map<string, FinalTx> = new Map()

  private lastMessageDate: Date = new Date(0)

  private deadCounter: number = 0

  private synced: boolean = false

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    @Inject(GRPC_CLIENT) readonly grpcClient: GrpcClient,
    @InjectEventEmitter() private readonly eventBus: EventBus,
  ) {
    this.loggerService.setContext(GrpcService.name)
    this.eventBus.on('startSync', this.startSync.bind(this))
    this.eventBus.on('resumeSync', this.resumeSync.bind(this))
    this.eventBus.on('pauseSync', this.pauseSync.bind(this))
  }

  onApplicationBootstrap() {
    this.cacheCleaner()
    this.deadGrpcCheck()
    // setTimeout(() => {
    //   console.log(this.eventsStream)
    //   this.eventsStream.cancel()
    // }, 5000)
  }

  onApplicationShutdown() {
    if (this.eventsStream) {
      this.unbindHandlers()
      this.loggerService.warn('Closing GRPC stream')
      this.eventsStream.cancel()
      this.grpcClient.reset()
    }
  }

  private deadGrpcCheck() {
    const outdated = this.lastMessageDate < new Date(Date.now() - this.configService.getDeadBlockchainTimeout())
    if (outdated) {
      this.deadCounter++
      if (this.synced) {
        this.loggerService.warn(`Last blockchain event received at ${this.lastMessageDate}`)
      }
    } else {
      this.deadCounter = 0
    }

    if (this.deadCounter > MAX_DEAD_GRPC_WARNINGS && this.eventsStream) {
      this.eventsStream.cancel()
      this.deadCounter = 0
    }

    setTimeout(this.deadGrpcCheck.bind(this), 10000)
  }

  private cacheCleaner() {
    this.liquidTxs.forEach(this.txCacheCleaner)
    this.finalTxs.forEach(this.txCacheCleaner)
    setTimeout(this.cacheCleaner.bind(this), 1000)
  }

  bindHandlers() {
    this.eventsStream.on('data', this.receiveMessage.bind(this))
    this.eventsStream.on('end', this.receiveEnd.bind(this))
    this.eventsStream.on('error', this.receiveError.bind(this))
    this.eventsStream.on('close', this.receiveCloseStream.bind(this))
  }

  unbindHandlers() {
    this.eventsStream.removeAllListeners()
  }

  resumeSync() {
    this.eventsStream.resume()
  }

  pauseSync() {
    this.eventsStream.pause()
  }

  isSynced() {
    return this.synced
  }

  async startSync(signature?: Uint8Array) {
    if (this.eventsStream) {
      this.pauseSync()
      this.unbindHandlers()
      this.eventsStream.cancel()
    }

    const subscribeOptions: we.ISubscribeOnRequest = {
      eventsFilters: [{
        txTypeFilter: {
          txTypes: [105],
        },
      }],
    }

    if (signature) {
      subscribeOptions.blockSignature = we.BlockSignature.fromObject({
        lastBlockSignature: {
          value: signature,
        },
      })
    } else {
      subscribeOptions.genesisBlock = {}
    }

    // @ts-ignore
    this.eventsStream = await this.grpcClient.eventsService.subscribeOn(subscribeOptions, this.grpcClient.metadata)
    this.bindHandlers()
  }

  async receiveMessage(response: we.IBlockchainEvent) {
    const event = new we.BlockchainEvent(response)

    const {
      blockchainEvent,
      appendedBlockHistory,
      blockAppended,
      microBlockAppended,
      rollbackCompleted,
    } = event

    this.lastMessageDate = new Date()

    if (blockchainEvent !== 'appendedBlockHistory' && !this.synced) {
      this.synced = true
      this.loggerService.warn('----- BLOCKCHAIN SYNCED! -----')
    }

    const heightInfo =
      appendedBlockHistory && `height: ${appendedBlockHistory.height} `
      || blockAppended && `height: ${blockAppended.height}` || ''

    const txsInfo = appendedBlockHistory && appendedBlockHistory.txs && `txs: ${appendedBlockHistory.txs?.length}`
      || microBlockAppended && microBlockAppended.txs && `txs: ${microBlockAppended.txs.length}` || ''

    this.loggerService.verbose(`Receive event: ${blockchainEvent} ${[heightInfo, txsInfo].filter(Boolean).join(' ')}`)

    if (blockchainEvent === 'appendedBlockHistory' && appendedBlockHistory) {
      await this.receiveHistoryBlock(appendedBlockHistory)

    } else if (blockchainEvent === 'blockAppended' && blockAppended) {
      await this.receiveNewBlock(blockAppended)

    } else if (blockchainEvent === 'microBlockAppended' && microBlockAppended) {
      if (microBlockAppended.txs) {
        microBlockAppended.txs.map((tx) => {
          const id = this.getTxId(tx)
          this.liquidTxs.set(id.toString('hex'), { ...tx, timestamp: new Date() })
        })
      }

    } else if (blockchainEvent === 'rollbackCompleted' && rollbackCompleted && rollbackCompleted.returnToBlockSignature) {
      this.pauseSync()

      const signature = rollbackCompleted.returnToBlockSignature
      this.eventBus.emit('rollback', signature)
    } else {
      this.loggerService.error('Unexpected message from node', JSON.stringify(response))
    }
  }

  async reconnect(wait: boolean = true) {
    this.unbindHandlers()
    this.eventsStream.cancel()
    this.synced = false
    await this.grpcClient.reconnect(wait)
    this.eventBus.emit('connected')
  }

  receiveEnd(e: any) {
    this.loggerService.error('Receive end of stream', e)
  }

  async receiveCloseStream(e: any) {
    const message = parseGrpcError(e)
    this.loggerService.error('GRPC stream are closed', message, 'closeStream')
    await this.reconnect()
  }

  receiveError(e?: Error & { code: number, metadata?: Metadata }) {
    if (e instanceof Error) {
      if (e.code === 1) {
        this.loggerService.warn(e.message)
      } else if (e.code === 5) {
        this.eventBus.emit('notFound')
        this.unbindHandlers()
        return
      } else {
        this.loggerService.error(`Error received: ${e.message} ${e.metadata && e.metadata.get('error-message')}`)
      }
    } else {
      this.loggerService.error('Unknown error received')
      process.exit(1)
    }
  }


  receiveHistoryBlock({ txs, ...body }: we.IAppendedBlockHistory) {
    const block = new we.AppendedBlockHistory(body) as we.AppendedBlockHistory

    const parsedBlock = this.parseBlock(block)
    const parsedTxs = this.parseTxs(txs, parsedBlock.height)

    parsedTxs.map(this.mapFinalTx)

    if (txs && txs.length) {
      this.pullTxFromCache(txs.map((tx) => this.getTxId(tx)))
    }

    this.eventBus.emit('blockReceived', parsedBlock, parsedTxs)

    if (txs && txs.length) {
      this.loggerService.log(`History block ${block.height} parsed. Transactions: ${txs ? txs.length : 0}`)
    }
  }

  receiveNewBlock(body: we.IBlockAppended) {
    const block = new we.BlockAppended(body)

    const parsedBlock = this.parseBlock(block)
    const blockTxs = block.txIds || []
    const txs = this.pullTxFromCache(blockTxs, true)
    const parsedTxs = this.parseTxs(txs, parsedBlock.height)
    parsedTxs.map(this.mapFinalTx)

    this.eventBus.emit('blockReceived', parsedBlock, parsedTxs)

    if (txs.length) {
      this.loggerService.log(`Block ${block.height} parsed. Transactions: ${txs.length}`)
    }
  }

  parse103(raw: we.IExecutedContractTransaction, height: number): Tx {
    const tx = new we.ExecutedContractTransaction(raw)
    const subTx = new we.CreateContractTransaction(tx.tx!.createContractTransaction!)

    return {
      contractId: subTx.id,
      ts: new Date(+(tx.timestamp)),
      params: {
        contractName: subTx.contractName,
        image: subTx.image,
        imageHash: subTx.imageHash,
      },
      diff: {},
      txId: subTx.id,
      senderPublicKey: subTx.senderPublicKey,
      height,
      operation: VotingOperation.createContract,
    }
  }

  parse104(raw: we.IExecutedContractTransaction, height: number): Tx {
    const tx = new we.ExecutedContractTransaction(raw)

    let subTx
    let contractId
    if (tx.tx!.createContractTransaction) {
      subTx = new we.CreateContractTransaction(tx.tx!.createContractTransaction!)
      contractId = subTx.id
    } else {
      subTx = new we.CallContractTransaction(tx.tx!.callContractTransaction!)
      contractId = subTx.contractId
    }

    const params = this.parseDataEntry(subTx.params)
    const diff = this.parseDataEntry(tx.results)

    return {
      contractId,
      ts: new Date(+(tx.timestamp)),
      params,
      diff,
      txId: subTx.id,
      operation: params.operation,
      senderPublicKey: subTx.senderPublicKey,
      height,
    }
  }

  parseTxs(txs: we.ITransaction[] | null | undefined, height: number): Tx[] {
    const parsedTxs: Tx[] = []

    if (txs) {
      for (const tx of txs) {
        if (tx.executedContractTransaction && tx.executedContractTransaction.tx) {
          const subTx = tx.executedContractTransaction.tx
          if (subTx.createContractTransaction || subTx.callContractTransaction) {
            const callTx = this.parse104(tx.executedContractTransaction, height)

            if (subTx.createContractTransaction) {
              const createTx = this.parse103(tx.executedContractTransaction, height)
              createTx.params = callTx.params
              createTx.diff = callTx.diff
              parsedTxs.push(createTx)
            } else {
              parsedTxs.push(callTx)
            }
          }
        }
      }
    }
    return parsedTxs // .sort((a, b) => b.ts.getTime() - a.ts.getTime())
  }

  parseBlock(block: we.AppendedBlockHistory | we.BlockAppended): Block {
    return {
      height: +block.height,
      signature: block.blockSignature,
      createdAt: new Date(+block.timestamp),
    }
  }

  parseDataEntry(params: we.IDataEntry[]) {
    const parsed: { [key: string]: any } = {}
    params.map((param) => {
      const { key, value, ...rest } = new we.DataEntry(param)
      let parsedValue: any
      switch (value) {
        case 'binaryValue':
          parsedValue = param.binaryValue
          break
        case 'boolValue':
          parsedValue = rest.boolValue
          break
        case 'intValue':
          parsedValue = parseInt(rest.intValue!.toString(), 10)
          break
        case 'stringValue':
          parsedValue = rest.stringValue
          break
      }
      parsed[key] = parsedValue
    })
    return parsed
  }

  async getStatus(txId: Uint8Array): Promise<string> {
    const requestParams: we.IContractExecutionRequest = { txId }
    const request: any = await this.grpcClient.statusService.contractExecutionStatuses(requestParams)
    return new Promise((resolve) => {
      request.on('data', (data: we.ContractExecutionResponse) => {
        resolve(data.message)
      })
      request.on('error', (err: { details: string, code: number }) => {
        resolve(err.details)
      })
    })


  }

  waitForTxMined(key: string): Promise<TxStatus> {
    return new Promise(async (resolve, reject) => {
      let finished = false
      const started = new Date()
      while (!finished) {
        finished = this.finalTxs.has(key)
        await sleep(1000)
        if (started < new Date(Date.now() - this.configService.getTxSuccessTimeout())) {
          const message = await this.getStatus(fromHex(key))
          return reject(new Error(message))
        }
      }
      resolve({
        id: key,
        success: true,
        message: [],
      })
    })
  }


  private pullTxFromCache(blockTxs: Uint8Array[] = [], strict: boolean = false): we.ITransaction[] {
    const txs: we.ITransaction[] = []
    blockTxs.map((txId) => {
      let found: boolean = false
      const id = Buffer.from(txId).toString('hex')
      this.liquidTxs.forEach((cachedTx, key) => {
        if (id === key) {
          const { ...cleaned } = cachedTx
          found = true
          txs.push(cleaned)
          this.liquidTxs.delete(key)
        }
      })
      if (!found && strict) {
        const message = `Transaction ${id} not found in cache`
        this.loggerService.error(message)
        this.eventsStream.cancel()
      }
    })
    if (txs && txs.length) {
      this.loggerService.warn(`Removed ${txs.length} transactions from cache. Cache size: ${this.liquidTxs.size}`)
    }
    return txs
  }

  private getTxId = (tx: we.ITransaction) => {
    const txType = Object.keys(tx).filter(key => key !== 'version')[0]
    return (tx as any)[txType].id
  }

  private txCacheCleaner = (tx: LiquidTx | FinalTx, key: string, list: Map<string, LiquidTx | FinalTx>) => {
    if (tx.timestamp < new Date(Date.now() - TX_POOL_TTL)) {
      list.delete(key)
    }
  }

  private mapFinalTx = (tx: Tx) => {
    const key = Buffer.from(tx.txId).toString('hex')
    this.finalTxs.set(key, {
      message: 'unknown',
      status: 'success',
      timestamp: new Date(),
      txId: tx.txId,
    })
  }

}
