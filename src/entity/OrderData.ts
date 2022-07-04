import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('orderData')
export class OrderData {

  @PrimaryGeneratedColumn('increment', { unsigned: true, name: 'order_id' })
  	orderId: number

  @Column('int', { unsigned: true, name: 'good_id' })
  	goodId: number

  @Column('char', { length: 7 })
  	buyer: string

  @Column('char', { length: 7 })
  	seller: string

  @Column('decimal', { precision: 6, scale: 2 })
  	price: number

  @Column('varchar', { length: 600, nullable: true })
  	review: string

  @Column('datetime', { nullable: true, name: 'review_time' })
  	reviewTime: string

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  	rate: number

  @Column('varchar', { length: 12 })
  	stat: '待付款' | '待确认' | '待评价' | '已完成' | '已取消'

  @Column('datetime', { name: 'generated_time' })
  	generatedTime: string

  @Column('varchar', { length: 12, nullable: true })
  	reported: '未举报' | '待处理' | '已驳回' | '已封禁'

}
