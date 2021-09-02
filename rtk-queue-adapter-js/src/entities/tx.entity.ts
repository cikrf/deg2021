import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { TxBody } from './tx-body.entity'

export enum TxStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RETRY = 'RETRY',
  FAIL = 'FAIL',
}

export enum BroadcastErrorStatus {
  ALREADY_IN_THE_STATE = 'ALREADY_IN_THE_STATE',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  ALREADY_IN_PROCESSING = 'ALREADY_IN_PROCESSING',
  CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',
  UNKNOWN = 'UNKNOWN'
}

@Entity('tx')
export class Tx {
  @PrimaryColumn({ name: 'id' })
  id: string

  @Column({ name: 'contract_id' })
  contractId: string

  @Column({ type: 'enum', name: 'status', enum: TxStatus, default: TxStatus.NEW })
  @Index()
  status?: TxStatus

  @Column({ type: 'enum', name: 'last_broadcast_error_status', enum: BroadcastErrorStatus, nullable: true })
  @Index()
  lastBroadcastErrorStatus?: BroadcastErrorStatus

  @CreateDateColumn({ name: 'created', type: 'timestamptz' })
  @Index()
  createdAt: Date

  @UpdateDateColumn({ name: 'modified', type: 'timestamptz' })
  updatedAt: Date

  @Column({ name: 'height', nullable: true })
  height?: number

  @Column({ name: 'error_message', nullable: true })
  errorMessage?: string

  @Column({ name: 'error_code', default: 0 })
  errorCode?: number

  @Column({ name: 'resend_counter', default: 0 })
  resendCounter?: number

  @Column({ name: 'resent', nullable: true, type: 'timestamptz' })
  resentAt?: Date

  @OneToOne(() => TxBody, {
    cascade: true,
  })
  @JoinColumn()
  body: TxBody

}
