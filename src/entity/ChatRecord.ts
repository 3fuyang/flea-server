import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('chatRecord')
export class ChatRecord {

  @PrimaryColumn('char', { length: 7, name: 'a_user_id' })
  	aUserId: string

  @PrimaryColumn('char', { length: 7, name: 'b_user_id' })
  	bUserId: string

  @PrimaryColumn('datetime', { name: 'date_time' })
  	dateTime: string

  @PrimaryColumn('decimal', { precision: 1, scale: 0 })
  	speaker: 0 | 1

  @Column('varchar', { length: 400 })
  	details: string

}
