import { Entity, PrimaryColumn } from 'typeorm'

@Entity('browseTrack')
export class BrowseTrack {

  @PrimaryColumn('char', { length: 7, name: 'user_id' })
  	userId: string

  @PrimaryColumn('int', { unsigned: true, name: 'good_id' })
  	goodId: string

  @PrimaryColumn('datetime', { name: 'day_time' })
  	dayTime: string

}
