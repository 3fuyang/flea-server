import { Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Browsetrack {

  @PrimaryColumn('char', { length: 7 })
  user_id: string

  @PrimaryColumn('int', { unsigned: true })
  good_id: string

  @PrimaryColumn('datetime')
  day_time: string

}
