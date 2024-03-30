import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('betting')
export class BettingEntity {
  @PrimaryColumn('text')
  address: string

  @PrimaryColumn('int')
  gameId: number

  @Column('int')
  eggs: number

  @Column('int')
  position: number

}