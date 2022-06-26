import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity()
export class ReportData {

  @PrimaryColumn('int', { unsigned: true })
  order_id: number

  @Column('datetime')
  report_time: string

  @Column('varchar', { length: 400 })
  reason: string

  @Column('char', { length: 4, nullable: true })
  replyer: string

  @Column('varchar', { length: 300, nullable: true })
  reply: string

  @Column('varchar', { length: 9 })
  stat: string

  @Column('datetime', { nullable: true })
  reply_time: string

}
