import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum VotingOperation {
  createContract = 'createContract',
  addMainKey = 'addMainKey',
  startVoting = 'startVoting',
  finishVoting = 'finishVoting',
  decryption = 'decryption',
  commissionDecryption = 'commissionDecryption',
  results = 'results',
  blindSigIssue = 'blindSigIssue',
  addVotersList = 'addVotersList',
  vote = 'vote',
}

export const STORED_TX_OPERATIONS = [
  VotingOperation.createContract,
  VotingOperation.addMainKey,
  VotingOperation.startVoting,
  VotingOperation.finishVoting,
  VotingOperation.decryption,
  VotingOperation.commissionDecryption,
  VotingOperation.results,
]

@Entity('tx')
@Index(['contractId', 'operation'])
export class Tx {
  @PrimaryGeneratedColumn({ name: 'index' })
  index?: number

  @Column({ name: 'height' })
  @Index()
  height: number

  @Column({ type: 'bytea', name: 'contract_id' })
  contractId: Uint8Array

  @Column({ name: 'operation', enum: VotingOperation })
  operation: VotingOperation

  @Column({ type: 'bytea', name: 'sender_public_key' })
  @Index()
  senderPublicKey: Uint8Array

  @Column({ type: 'bytea', name: 'tx_id' })
  txId: Uint8Array

  @Column({ name: 'params', type: 'json' })
  params: any

  @Column({ name: 'diff', type: 'json' })
  diff: any

  @Column({ name: 'time_stamp', type: 'timestamptz' })
  @Index()
  ts: Date
}
