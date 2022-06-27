import { Entity, Column, PrimaryColumn } from 'typeorm'

// 注意：实体名中间的大写字母会被转换为'_小写字母'的形式
// 映射数据库中已有的表时，需要名称、字段类型完全对应
@Entity()
export class Useraccount {

  @PrimaryColumn('char', { length: 7, name: 'user_id' })
   	userId: string

  @Column('varchar', { length: 20 })
  	mypassword: string

  @Column('varchar', { length: 24, name: 'real_name' })
  	realName: string

  @Column('varchar', { length: 24 })
   	nickname: string

  @Column('varchar', { length: 3 })
   	gender: string

  @Column('varchar', { length: 15 })
   	telnum: string

  @Column('date')
  	birthday: string

  @Column('varchar', { length: 25 })
  	college: string

  @Column('varchar', { length: 60 })
   	biography: string

  @Column('varchar', { length: 30 })
   	avatar: string

  @Column('decimal', { precision: 2, scale: 1 })
  	rate: number

  @Column('decimal', { precision: 1, scale: 0 })
  	available: number

}
