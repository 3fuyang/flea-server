import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Goodinfo {

  @PrimaryGeneratedColumn('increment', { unsigned: true, name: 'good_id' })
  	goodId: number

  @Column('char', { length: 7, name: 'seller_id' })
  	sellerId: string

  @Column('decimal', { precision: 6, scale: 2 })
  	price: number

  @Column('varchar', { length: 10, default: '其他' })
  	category: string

  @Column('decimal', { precision: 1, scale: 0, default: 0 })
  	available: 0 | 1

  @Column('varchar', { length: 30, name: 'good_name' })
  	name: string

  @Column('varchar', { length: 60 })
  	title: string

  @Column('varchar', { length: 30 })
  	keywords: string

  @Column('varchar', { length: 15, default: '四平路校区' })
  	campus: '四平路校区' | '嘉定校区' | '沪西校区' | '沪北校区'

  @Column('varchar', { length: 600, default: '看不懂，很神秘。' })
  	intro: string

  @Column('varchar', { length: 200 })
  	images: string

  @Column('datetime', { name: 'onshelf_time' })
  	onshelfTime: string

}
