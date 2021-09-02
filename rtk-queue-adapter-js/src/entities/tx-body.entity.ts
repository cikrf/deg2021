import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tx_body')
export class TxBody {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number

  @Column({ type: 'json', name: 'body' })
  body: Record<string, any>
}
