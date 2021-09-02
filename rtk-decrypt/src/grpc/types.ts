import { wavesenterprise as we, wavesenterprise } from './proto/root'
import { NodeConfig } from '../types/general'
import { Metadata } from '@grpc/grpc-js'
import BlockchainEventsService = wavesenterprise.BlockchainEventsService
import ContractStatusService = wavesenterprise.ContractStatusService
import TransactionPublicService = wavesenterprise.grpc.TransactionPublicService

export type GrpcClient = {
  eventsService: BlockchainEventsService,
  statusService: ContractStatusService,
  transactionService: TransactionPublicService,
  metadata: Metadata,
  nodeConfig: NodeConfig,
  reconnect: (wait: boolean) => void,
  init: () => void,
  reset: () => void,
}

export type LiquidTx = we.ITransaction & {
  timestamp: Date,
}

export type FinalTx = {
  txId: Uint8Array,
  timestamp: Date,
  status: 'success' | 'error',
  message: string,
}

export type TxStatus = {
  id: string,
  message: string[],
  success: boolean,
}

export type GrpcError = {
  code: number,
  details: string,
  metadata: Metadata,
}

export type ContractParam = { [key: string]: string | boolean | number | Uint8Array }

export enum TxTypes {
  createContract = 'createContract',
  callContract = 'callContract',
}

export enum Operation {
  addMainKey = 'addMainKey',
  startVoting = 'startVoting',
  finishVoting = 'finishVoting',
  decryption = 'decryption',
  commissionDecryption = 'commissionDecryption',
  results = 'results',
}

export enum ParamType {
  // eslint-disable-next-line id-blacklist
  string = 'string',
  integer = 'integer',
  // eslint-disable-next-line id-blacklist
  boolean = 'boolean',
  binary = 'binary',
}

export enum DataType {
  INTEGER,
  BOOLEAN,
  BINARY,
  STRING
}
