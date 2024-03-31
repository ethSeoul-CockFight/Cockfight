import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('betting')
export class BettingEntity {
  @PrimaryColumn('text')
  address: string

  @PrimaryColumn('int')
  game_id: number

  @Column('int')
  egg: number

  @Column('int')
  position: number

}