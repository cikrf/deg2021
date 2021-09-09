import * as EC from 'elliptic'
import BasePoint = EC.curve.base.BasePoint

export enum fieldsEnum {
  'nestedTxId',
  'type',
  'signature',
  'version',
  'ts',
  'senderPublicKey',
  'fee',
  'feeAssetId',
  'params',
  'diff',
  'extra',
  'rollback',
}

export enum VotingOperation {
  createContract = 'createContract',
  addMainKey = 'addMainKey',
  startVoting = 'startVoting',
  finishVoting = 'finishVoting',
  decryption = 'decryption',
  commissionDecryption = 'commissionDecryption',
  results = 'results',
  blindSigIssue = 'blindSigIssue',
  vote = 'vote',
  addVotersList = 'addVotersList'
}

export type Tx = {
  nestedTxId: string,
  type: number,
  signature: string,
  version: number,
  ts: number,
  senderPublicKey: string,
  fee: number,
  feeAssetId: string,
  params: any,
  diff: any,
  raw: any,
  operation: VotingOperation
  extra: any,
  contractId: string
  rolledback?: boolean
}

export type Point = string

export type KeyPair = {
  privateKey: Buffer,
  publicKey: Buffer,
}

export type KeyPairAndDecryption = KeyPair & {
  decryption: Decryption[][],
}

export type CryptoConfig = {
  a: string,
  b: string,
  p: string,
  q: string,
  base: string,
}

export type ABBytes = { A: Buffer, B: Buffer }

export type SumAB = ABBytes[][]

export type Decryption = {
  P: string,
  w: string,
  U1: string,
  U2: string,
}

export type ValidationResult = {
  txId: string,
  valid: boolean
  operation?: VotingOperation
}

export type DLPResult = {
  key: Buffer,
  sum: number,
}

export type Curve = EC.ec

export type CurvePoint = BasePoint

export const STATE_TX_OPERATIONS = [
  VotingOperation.createContract,
  VotingOperation.addMainKey,
  VotingOperation.startVoting,
  VotingOperation.finishVoting,
  VotingOperation.decryption,
  VotingOperation.commissionDecryption,
  VotingOperation.results,
]
export const VOTERS_TX_OPERATIONS = [
  VotingOperation.blindSigIssue,
  VotingOperation.vote,
]

export enum DataType {
  INTEGER,
  BOOLEAN,
  BINARY,
  STRING
}

export type ContractState = Record<string, any>

export type BulletinsSum = { acc: SumAB, valid: number }

export type ValidationConfig = {
  debug: boolean,
  txSig: boolean,
  blindSig: boolean
  zkp: boolean
}
