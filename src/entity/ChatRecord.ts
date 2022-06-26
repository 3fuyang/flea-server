import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Chatrecord {

  @PrimaryColumn('char', { length: 7 })
  a_user_id: string

  @PrimaryColumn('char', { length: 7 })
  b_user_id: string

  @PrimaryColumn('datetime')
  date_time: string

  @PrimaryColumn('decimal', { precision: 1, scale: 0 })
  speaker: number

  @Column('varchar', { length: 400 })
  details: string

}
