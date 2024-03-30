/* eslint-disable @typescript-eslint/no-unused-vars */
import { MarketEntity, UserEntity } from 'orm'
import { EntityManager } from 'typeorm'
import { Bot } from './Bot'
import { getModuleStoreWithRetry } from 'lib/retry'

const MARKET_FEED_INTERVAL = 60 * 1000

export class MarketFeeder extends Bot {
  async getLastMarketEntity(manager: EntityManager): Promise<MarketEntity | null> {
    const marketEntity = await manager.getRepository(MarketEntity).find({
      order: { time: 'DESC', } as any,
      take: 1
    })

    return marketEntity[0] ?? null
  }

  async getFeedTime(manager: EntityManager): Promise<Date> {
    const marketEntity = await this.getLastMarketEntity(manager)

    if (!marketEntity) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now
    }
    return marketEntity.time
  }

  getNextFeedTime(time: Date): Date {
    return new Date(time.getTime() + MARKET_FEED_INTERVAL)
  }


  async getNextStage(manager: EntityManager): Promise<number>{
    const marketEntity = await this.getLastMarketEntity(manager)

    if (!marketEntity) {
      return 1
    }
    return marketEntity.stage + 1
  }

  async feed(manager: EntityManager, time: Date): Promise<void> {
    const moduleStore = await getModuleStoreWithRetry();

    const users = await manager.getRepository(UserEntity).find()
    let totalEggNum = 0;
    if (users.length !== 0) {
      for (const user of users) {
        const userEggNum = user.egg
        totalEggNum += userEggNum
      }
    }

    const entity: MarketEntity = {
      time: this.getNextFeedTime(time),
      stage: await this.getNextStage(manager),
      totalChickenNum: parseInt(moduleStore.total_chickens) ?? 0,
      totalEggNum, 
      chickenPrice: parseInt(moduleStore.chicken_price) ?? 0,
      eggPrice: parseInt(moduleStore.egg_price) ?? 0,
    }
    await manager.getRepository(MarketEntity).save(entity)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = new Date(await this.getFeedTime(manager))
    if (this.nextFeedTs > new Date()) return
    await this.feed(manager, this.nextFeedTs);
  }
}
