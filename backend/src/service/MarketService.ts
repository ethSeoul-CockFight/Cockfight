import { UserEntity, YieldPlanEntity, getDB } from 'orm'

interface GetMarketListResponse {
  total_chicken: number
  total_egg: number
}

export async function getMarket(): Promise<GetMarketListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      UserEntity,
      'user'
    )

    const users = await qb.getMany()
    
    const totalChicken = users.reduce((acc, user) => acc + user.chicken, 0)
    const totalEgg = users.reduce((acc, user) => acc + user.egg, 0)
    return {
      total_chicken: totalChicken,
      total_egg: totalEgg
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


interface TradeParam {
  address: string
  chicken: number
  egg: number
  is_buy: boolean
}



export async function trade(
  param: TradeParam
): Promise<boolean> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('master')

  try {
    const { address, chicken, egg, is_buy } = param

    const qb = queryRunner.manager
      .getRepository(UserEntity)

    const user = await qb.findOne({
      where: {
        address
      }
    })

    if (!user && !is_buy) throw new Error('user not found')
    if (user && !is_buy && user?.egg < egg) throw new Error('not enough eggs')
    if (user && !is_buy && user?.chicken < chicken) throw new Error('not enough chickens')
        
    if (!user && is_buy){
      await qb.save({
        address,
        egg,
        chicken
      })
      return true
    }
    
    if (!user) throw new Error('user not found')
    user.egg += is_buy ? egg : -egg
    user.chicken += is_buy ? chicken : -chicken
    await qb.save(user)
    
    return true
  } finally {
    await queryRunner.release()
  }
}