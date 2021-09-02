import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

export enum MasterStatus {
  pollInitiated = 'pollInitiated',
  pollStarted = 'pollStarted',
  mainKeySent = 'mainKeySent',
  pollActive = 'pollActive',
  waitingCommissionKey = 'waitingCommissionKey',
  prepareResults = 'prepareResults',
  resultsReady = 'resultsReady',
  resultsFailed = 'resultsFailed',
}

@Entity('master')
export class Master {
  @PrimaryColumn({ name: 'id' })
  id: string

  @Column({ type: 'bytea', unique: true, name: 'contract_id' })
  contractId: Uint8Array

  @Column({ name: 'poll_id', unique: true })
  pollId: string

  @Column({ name: 'status', enum: MasterStatus, default: MasterStatus.pollInitiated })
  status: MasterStatus

  @Column({ type: 'bytea', name: 'public_key' })
  publicKey: Uint8Array

  @Column({ type: 'bytea', name: 'private_key' })
  privateKey: Uint8Array

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
