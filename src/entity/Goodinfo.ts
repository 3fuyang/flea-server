import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Goodinfo {

  @PrimaryGeneratedColumn('increment', { unsigned: true })
  good_id: number

  @Column('char', { length: 7 })
  seller_id: string

  @Column('decimal', { precision: 6, scale: 2 })
  price: number

  @Column('varchar', { length: 10 })
  category: string

  @Column('decimal', { precision: 1, scale: 0 })
  available: number

  @Column('varchar', { length: 30 })
  good_name: string

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

  @Column('datetime')
  onshelf_time: string

}
