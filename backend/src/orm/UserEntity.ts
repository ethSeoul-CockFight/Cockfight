import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user')
export class UserEntity {
    @PrimaryColumn('text')
    address: string
    
    @Column('int')
    chicken: number

    @Column('int')
    egg: number
}