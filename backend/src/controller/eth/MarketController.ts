import { Context } from 'koa'
import { KoaController, Get, Controller, Post, Validate } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getMarketList, getNextEggTime, tradeEggs } from 'service/MarketService'

@Controller('')
export class MarketController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/market',
    summary: 'Get market data',
    tags: ['Market'],
    operationId: 'getMarket',
    request: {
      query: z.object({
        time: z.string().optional(),
      }),
    },
  })
  @Get('/market')
  async getMarketList(ctx: Context): Promise<void> {
    const markets = await getMarketList(ctx.query as any)
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
    summary: 'Trade eggs',
    description: 'Trade eggs',
    tags: ['Market'],
    operationId: 'tradeEggs',
    requestBody: {
      description: 'post trade eggs',
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
              eggs: {
                type: 'number',
                description: 'The id of the game'
              },
              is_buy: {
                type: 'boolean',
                description: 'The position of the user'
              },
            },
            required: ['address', 'eggs', 'is_buy']
          }
        },
      }
    }
  })
  @Post('/market/trade')
  async tradeEggs(ctx: Context): Promise<void> {
    success(ctx, await tradeEggs(ctx.request.body as any))
  }
}