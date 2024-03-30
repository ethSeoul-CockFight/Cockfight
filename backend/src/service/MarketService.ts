import { MarketEntity, UserEntity, YieldPlanEntity, getDB } from 'orm'

export interface GetMarketListParam {
  time?: string
  limit: number
}

interface GetMarketListResponse {
  markets: MarketEntity[]
}

export async function getMarketList(
  param: GetMarketListParam
): Promise<GetMarketListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const limit = Number(param.limit) ?? 20

    const qb = queryRunner.manager.createQueryBuilder(
      MarketEntity,
      'market'
    )
    
    if (param.time) {
      qb.where('market.time <= :time', { time: param.time })
    }
    
    const markets = await qb
      .orderBy('market.time', 'DESC')
      .limit(limit)
      .getMany()

    return {
      markets
    }
  } finally {
    await queryRunner.release()
  }
}

interface GetNextEggTimeResponse {
  next_egg_time: string
}

export function getCurrentTimeSecond(): number {
  return Math.floor(Date.now() / 1000)
}

export async function getNextEggTime(
): Promise<GetNextEggTimeResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.getRepository(YieldPlanEntity)
    
    const yieldPlan = await qb.findOne({
      order: {
        stage: 'DESC'
      }
    })

    if (!yieldPlan) {
      const currentTime = getCurrentTimeSecond()
      const newYieldPlan: YieldPlanEntity = {
        stage: 0,
        fund_time: currentTime.toString(),
        next_fund_time: (currentTime + 60).toString()
      }

      await qb.save(newYieldPlan)
      return {
        next_egg_time: new Date().toISOString()
      }
    }

    yieldPlan.stage += 1
    const next_fund_time = yieldPlan.next_fund_time
    yieldPlan.fund_time = yieldPlan.next_fund_time
    yieldPlan.next_fund_time = (Number(yieldPlan.next_fund_time) + 60).toString()
    
    return {
      next_egg_time : next_fund_time
    }
  } finally {
    await queryRunner.release()
  }
}


interface TradeEggsParam {
  address: string
  eggs: number
  is_buy: boolean
}



export async function tradeEggs(
  param: TradeEggsParam
): Promise<boolean> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('master')

  try {
    const { address, eggs, is_buy } = param

    const qb = queryRunner.manager
      .getRepository(UserEntity)

    const user = await qb.findOne({
      where: {
        address
      }
    })

    if (!user && !is_buy) throw new Error('user not found')
    if (user && !is_buy && user?.egg < eggs) throw new Error('not enough eggs')
    
    if (!user && is_buy){
      await qb.save({
        address,
        egg: eggs,
        chicken: 0
      })
      return true
    }
    
    if (!user) throw new Error('user not found')
    user.egg += is_buy ? eggs : -eggs
    await qb.save(user)
    
    return true
  } finally {
    await queryRunner.release()
  }
}