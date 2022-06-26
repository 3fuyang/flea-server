import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Orderdata {

  @PrimaryGeneratedColumn('increment', { unsigned: true })
  order_id: number

  @Column('int', { unsigned: true })
  good_id: number

  @Column('char', { length: 7 })
  buyer: string

  @Column('char', { length: 7 })
  seller: string

  @Column('decimal', { precision: 6, scale: 2 })
  price: number

  @Column('varchar', { length: 600, nullable: true })
  review: string

  @Column('datetime', { nullable: true })
  review_time: string

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  rate: number

  @Column('varchar', { length: 12 })
  stat: string

  @Column('datetime')
  generated_time: string

  @Column('varchar', { length: 12, nullable: true })
  reported: string

}
