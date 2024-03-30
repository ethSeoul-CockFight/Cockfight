import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('yield_plan')
export class YieldPlanEntity {
    @PrimaryColumn('int')
    stage: number

    @Column({ type: 'bigint' })
    fund_time: string  

    @Column({ type: 'bigint' })
    next_fund_time: string
}