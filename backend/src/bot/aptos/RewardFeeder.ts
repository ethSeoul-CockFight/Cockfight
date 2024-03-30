/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from 'config'
import { UserEntity } from 'orm'
import { EntityManager, TableExclusion } from 'typeorm'
import { Bot } from './Bot'
import { getAllTableEntries, getResource } from 'lib/lcd'
import { AccAddress } from '@initia/initia.js'
import { stripQuotes } from 'lib/util'
import { getModuleStoreWithRetry } from 'lib/retry'

export const REWARD_FEED_INTERVAL = 60 * 1000
export const YIELD_PER_CHICKEN = 2

interface ChickenMap {
  [address: AccAddress]: number
}

export class RewardFeeder extends Bot {
  async getAllUserChickens(): Promise<ChickenMap> {
    const chickenMap: ChickenMap = {}
    const moduleStore = await getModuleStoreWithRetry();
    const chickensTableHandle = moduleStore.chickens

    if (!moduleStore) throw new Error('module store not found');

    const chickenEntries = await getAllTableEntries(
      config.l1lcd,
      chickensTableHandle
    )
    
    for (const entry of chickenEntries) {
      const address = AccAddress.fromHex(stripQuotes(entry.key))
      if (!chickenMap[address]) chickenMap[address] = 0
      const chicken = JSON.parse(entry.value) as any
      chickenMap[address] = parseInt(chicken)
    }

    return chickenMap
  }

  async saveUserChickens(manager: EntityManager, chickenMap: ChickenMap): Promise<void> {
    for (const [address, chicken] of Object.entries(chickenMap)) {
      const user = await manager.getRepository(UserEntity).findOne({ 
        where: { address }
      })

      const userEntity: UserEntity = {
        address,
        chicken,
        egg: user ? user.egg : 0
      }

      await manager.getRepository(UserEntity).save(userEntity);
    }
  }

  async feed(manager: EntityManager): Promise<void> {
    const users = await manager.getRepository(UserEntity).find()
    if (users.length === 0) return
    for (const user of users) {
        const chicken = user.chicken;
        if (chicken === 0) continue;
        const eggs = chicken * YIELD_PER_CHICKEN;
        user.egg += eggs;
        await manager.getRepository(UserEntity).save(user);
    }
  }

  getFeedTime(): Date {   
    if (this.nextFeedTs == null) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now 
    }
    return this.nextFeedTs 
  }

  async getNextFeedTime(time: Date): Promise<Date> {
    return new Date(time.getTime() + REWARD_FEED_INTERVAL)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = this.getFeedTime()
    const chickenMap = await this.getAllUserChickens();
    await this.saveUserChickens(manager, chickenMap);
    if (this.nextFeedTs > new Date()) return
    await this.feed(manager);
    this.nextFeedTs = await this.getNextFeedTime(this.nextFeedTs)
  }
}
