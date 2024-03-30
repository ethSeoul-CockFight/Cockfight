import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('game')
export class GameEntity {
  @PrimaryColumn('int')
  game_id: number
  
  @Column('int', { nullable: true })
  winner_position: number | null

  @Column()
  end_time: number

  @Column()
  is_ended: boolean
}