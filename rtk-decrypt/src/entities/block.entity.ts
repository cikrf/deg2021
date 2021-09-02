import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('blocks')
export class Block {
  @PrimaryColumn({ name: 'height' })
  height: number

  @Column({ type: 'bytea', name: 'signature' })
  signature: Uint8Array

  @Column({ name: 'time_stamp', type: 'timestamptz' })
  createdAt: Date
}
