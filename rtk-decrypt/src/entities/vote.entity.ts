import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn({ name: 'index' })
  index?: number

  @Column({ name: 'height' })
  @Index()
  height: number

  @Column({ type: 'bytea', name: 'contract_id' })
  @Index()
  contractId: Uint8Array

  @Column({ type: 'bytea', name: 'sender_public_key' })
  @Index()
  senderPublicKey: Uint8Array

  @Column({ name: 'time_stamp', type: 'timestamptz' })
  @Index()
  ts: Date

  @Column({ name: 'failed', type: 'boolean' })
  failed: boolean

  @Column({ name: 'valid', type: 'boolean', default: false })
  valid?: boolean

  @Column({ name: 'processed', type: 'boolean', default: false })
  @Index({ where: 'NOT "processed"' })
  processed?: boolean

  @Column({ type: 'bytea', name: 'tx_id' })
  txId: Uint8Array

  @Column({ type: 'bytea', nullable: false, name: 'vote' })
  vote: Uint8Array

  @Column({ name: 'retry', default: 0 })
  retry?: number

}
