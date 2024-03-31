import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user')
export class UserEntity {
    @PrimaryColumn('text')
    address: string
    
    @Column('int')
    stable_chicken: number

    @Column('int')
    volatile_chicken: number

    @Column('int')
    egg: number
}