import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Adminaccount {

  @PrimaryColumn('char', { length: 7, name: 'user_id' })
  	userId: string

  @Column('varchar', { length: 20 })
  	mypassword: string

  @Column('varchar', { length: 24 })
  	nickname: string

  @Column('varchar', { length: 20 })
  	avatar: string

}
