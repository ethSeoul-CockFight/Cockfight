/* eslint-disable @typescript-eslint/no-unused-vars */
import { BettingEntity, GameEntity } from 'orm'
import { EntityManager } from 'typeorm'
import { Bot } from './Bot'

const GAME_FEED_INTERVAL = 5 * 60 * 1000 // 5 min

export class GameFeeder extends Bot {
  async getLastGameEntity(manager: EntityManager): Promise<GameEntity | null> {
    const gameEntity = await manager.getRepository(GameEntity).find({
      order: { gameId: 'DESC', } as any,
      take: 1
    })
    return gameEntity[0] ?? null
  }

  async calculateWinnerPosition(manager: EntityManager, gameId: number): Promise<number | null> {
    const bettings = await manager.getRepository(BettingEntity).find({
      where: { gameId }
    })
    if (bettings.length === 0) return null

    const positionCount = { 1: 0, 2:0 }
    let minPosition: number | null = null;
    let minCount = Infinity;

    for (const betting of bettings) {
      if (!positionCount[betting.position]) {
        positionCount[betting.position] = 0
      }
      positionCount[betting.position] += betting.eggs
    }
    // get minimum position
    for (const position in positionCount) {
      if (positionCount[position] < minCount) {
        minCount = positionCount[position]
        minPosition = Number(position)
      }
    }

    if (!minPosition) return null
    return minPosition 
  }

  async createGame(manager: EntityManager, time: Date): Promise<void> {
    const lastGameEntity = await this.getLastGameEntity(manager)
    const gameId = lastGameEntity ? lastGameEntity.gameId + 1 : 1
    const game: GameEntity = {
      gameId,
      positionNum: 2, // TODO: set position by game 
      winnerPosition: null,
      endTime: this.getNextFeedTime(time),
      isEnded: false
    }
    await manager.getRepository(GameEntity).save(game)
  }

  async distributeRewards(manager: EntityManager, gameId: number, winnerPosition: number): Promise<void> {
    const bettings = await manager.getRepository(BettingEntity).find({
      where: { gameId }
    })
    if (bettings.length === 0) return

    for (const betting of bettings) {
      if (betting.position === winnerPosition) {
        await manager.getRepository(BettingEntity).save({
          ...betting,
          reward: betting.eggs * 10
        })
      }
    }
  }
  
  async endGame(manager: EntityManager): Promise<void> {
    const games = await manager.getRepository(GameEntity).find({
      where: { isEnded: false }
    })
    if (games.length === 0) return

    const now = new Date()
    for (const game of games) {
      if (game.endTime < now) {
        
        const winnerPosition = await this.calculateWinnerPosition(manager, game.gameId)
        if (!winnerPosition) {
          await manager.getRepository(GameEntity).delete({
            gameId: game.gameId
          })
          continue
        }
        await manager.getRepository(GameEntity).save({
          ...game,
          isEnded: true,
          winnerPosition
        })

        // give reward for winner 
        await this.distributeRewards(manager, game.gameId, winnerPosition)
      }
    }
  }

  async getFeedTime(manager: EntityManager): Promise<Date> {
    const gameEntity = await this.getLastGameEntity(manager)

    if (!gameEntity) {
      const now = new Date();
      now.setSeconds(0, 0);
      return now
    }
    return gameEntity.endTime
  }

  getNextFeedTime(time: Date): Date {
    return new Date(time.getTime() + GAME_FEED_INTERVAL)
  }

  public async process(manager: EntityManager): Promise<void> {
    this.nextFeedTs = new Date(await this.getFeedTime(manager))
    await this.endGame(manager)
    
    if (this.nextFeedTs > new Date()) return
    await this.createGame(manager, this.nextFeedTs)
  }
}
