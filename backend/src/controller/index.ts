import { KoaController } from 'koa-joi-controllers'
import { BettingController } from './eth/BettingController'
import { MarketController } from './eth/MarketController'
import { UserController } from './eth/UserController'
import { GameController } from './eth/GameController'


const controllers = [
  BettingController,
  MarketController,
  UserController,
  GameController
]
  .map((prototype) => {
    const controller = new prototype()
    return controller
  })
  .filter(Boolean) as KoaController[]

export default controllers
