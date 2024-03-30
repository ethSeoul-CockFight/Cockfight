import { finalizeORM } from 'orm'
import { MarketFeeder } from './MarketFeeder'
import { Bot } from './Bot'
import { GameFeeder } from './GameFeeder'
import { RewardFeeder } from './RewardFeeder'

let bots: Bot[] = []

export async function runBot(): Promise<void> {
  bots = [
    new MarketFeeder(),
    new GameFeeder(),
    new RewardFeeder(),
  ]
  try {
    await Promise.all(
      bots.map((bot) => {
        bot.run()
      })
    )
  } catch (err) {
    stopBots()
  }
}

export async function stopBots(): Promise<void> {
  bots.forEach((bot) => bot.stop())
  await finalizeORM()
}
