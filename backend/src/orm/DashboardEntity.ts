import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('dashboard')
export class DashboardEntity {
    @PrimaryColumn('text')
    time: string
    
    @Column('float')
    apy: number

    @Column('int')
    tvl: number
}