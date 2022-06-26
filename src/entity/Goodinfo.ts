import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Goodinfo {

  @PrimaryGeneratedColumn('increment', { unsigned: true, name: 'good_id' })
  goodId: number

  @Column('char', { length: 7, name: 'seller_id' })
  sellerId: string

  @Column('decimal', { precision: 6, scale: 2 })
  price: number

  @Column('varchar', { length: 10 })
  category: string

  @Column('decimal', { precision: 1, scale: 0 })
  available: number

  @Column('varchar', { length: 30, name: 'good_name' })
  name: string

  @Column('varchar', { length: 60 })
  title: string

  @Column('varchar', { length: 30 })
  keywords: string

  @Column('varchar', { length: 15 })
  campus: string

  @Column('varchar', { length: 600 })
  intro: string

  @Column('varchar', { length: 200 })
  images: string

  @Column('datetime', { name: 'onshelf_time' })
  onshelfTime: string

}
