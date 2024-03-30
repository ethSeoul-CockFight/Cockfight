import { UserEntity, YieldPlanEntity, getDB } from 'orm'

interface GetMarketResponse {
  total_chicken: number
  total_egg: number
  volatile_chicken_price: number
  stable_chicken_price: number
}

export async function getMarket(): Promise<GetMarketResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      UserEntity,
      'user'
    )

    const users = await qb.getMany()
    
    const totalChicken = users.reduce((acc, user) => acc + user.volatile_chicken + user.stable_chicken, 0)
    const totalEgg = users.reduce((acc, user) => acc + user.egg, 0)
    return {
      total_chicken: totalChicken,
      total_egg: totalEgg,
      volatile_chicken_price: 1000,
      stable_chicken_price: 1000
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
  stable_chicken: number
  volatile_chicken: number
  egg: number
  is_buy: boolean
}



export async function trade(
  param: TradeParam
): Promise<boolean> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('master')

  try {
    const { address, stable_chicken, volatile_chicken, egg, is_buy } = param

    const qb = queryRunner.manager
      .getRepository(UserEntity)

    const user = await qb.findOne({
      where: {
        address
      }
    })

    if (!user && !is_buy) throw new Error('user not found')
    if (user && !is_buy && user?.egg < egg) throw new Error('not enough eggs')
    if (user && !is_buy && user?.stable_chicken < stable_chicken) throw new Error('not enough chickens')
    if (user && !is_buy && user?.volatile_chicken < volatile_chicken) throw new Error('not enough chickens')
        
    if (!user && is_buy){
      await qb.save({
        address,
        egg,
        stable_chicken,
        volatile_chicken
      })
      return true
    }
    
    if (!user) throw new Error('user not found')
    user.egg += is_buy ? egg : -egg
    user.stable_chicken += is_buy ? stable_chicken : -stable_chicken
    user.volatile_chicken += is_buy ? volatile_chicken : -volatile_chicken

    await qb.save(user)
    
    return true
  } finally {
    await queryRunner.release()
  }
}