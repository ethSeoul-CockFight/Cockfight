import { KoaController } from 'koa-joi-controllers'
import { BettingController } from './eth/BettingController'
import { SubmissionController } from './eth/SubmissionController'
import { MarketController } from './eth/MarketController'
import { UserController } from './eth/UserController'
import { RewardController } from './eth/RewardController'
import { GameController } from './eth/GameController'


const controllers = [
  BettingController,
  SubmissionController,
  MarketController,
  UserController,
  RewardController,
  GameController
]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
