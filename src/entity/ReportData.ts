import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Reportdata {

  @PrimaryColumn('int', { unsigned: true, name: 'order_id' })
  	orderId: number

  @Column('datetime', { name: 'report_time' })
  	reportTime: string

  @Column('varchar', { length: 400 })
  	reason: string

  @Column('char', { length: 4, nullable: true })
  	replyer: string

  @Column('varchar', { length: 300, nullable: true })
  	reply: string

  @Column('varchar', { length: 9, default: '待处理' })
  	stat: string

  @Column('datetime', { nullable: true, name: 'reply_time' })
  	replyTime: string

}
