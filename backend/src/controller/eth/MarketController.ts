import { Context } from 'koa'
import { KoaController, Get, Controller, Post } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getMarket, getNextEggTime, trade } from 'service/MarketService'

@Controller('')
export class MarketController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/market',
    summary: 'Get market data',
    tags: ['Market'],
    operationId: 'getMarket',
  })
  @Get('/market')
  async getMarket(ctx: Context): Promise<void> {
    const markets = await getMarket()
    if (markets) success(ctx, markets)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }



  @routeConfig({
    method: 'get',
    path: '/market/next_egg_time',
    summary: 'Get next_egg_time',
    tags: ['Market'],
    operationId: 'getNextEggTime',
  })
  @Get('/market/next_egg_time')
  async getNextEggTime(ctx: Context): Promise<void> {
    const nextEggTime = await getNextEggTime()
    if (nextEggTime) success(ctx, nextEggTime)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }

  @routeConfig({
    method: 'post',
    path: '/market/trade',
    summary: 'Trade',
    description: 'Trade',
    tags: ['Market'],
    operationId: 'trade',
    requestBody: {
      description: 'post trade',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: 'The address of the user'
              },
              egg: {
                type: 'number',
              },
              chicken: {
                type: 'number',
              },
              is_buy: {
                type: 'boolean',
                description: 'The position of the user'
              },
            },
            required: ['address', 'chicken', 'egg', 'is_buy']
          }
        },
      }
    }
  })
  @Post('/market/trade')
  async trade(ctx: Context): Promise<void> {
    success(ctx, await trade(ctx.request.body as any))
  }
}