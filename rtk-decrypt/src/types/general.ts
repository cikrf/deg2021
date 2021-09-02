import { Point } from '../crypto/types'
import { MasterStatus } from '../entities/master.entity'

export type NodeConfig = {
  additionalFee: { [key: string]: number },
  minimumFee: { [key: string]: number },
  gostCrypto: boolean,
  chainId: number,
}

export type Vote = {
  contractId: string,
  body: string,
}
export type VotingBase = {
  pollId: string,
  bulletinHash: string,
  dimension: number[][],
  dateStart?: Date,
  dateEnd?: Date,
  blindSigExponent: string,
  blindSigModulo: string,
}

export type ContractState = {
  DKG_KEY?: Point,
  COMMISSION_KEY?: Point,
  MAIN_KEY?: Point,
  VOTERS_LIST_REGISTRATORS: string[],
  SERVERS: string[],
  VOTING_BASE: VotingBase,
  RESULTS?: number[][],
}

export type RabbitMQConfig = {
  uri: string,
  exchange: string,
  incomingQueue: string,
  outcomingQueue: string,
  asyncSlotsCount: number,
}

export type TxMiningAction = MasterStatus | ((err?: Error) => void | Promise<unknown>)
