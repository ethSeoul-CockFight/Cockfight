import { Context } from 'koa'
import { KoaController, Get, Controller, Post, Validator } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getBetting, getGame, postBetting } from 'service'

@Controller('')
export class BettingController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/game',
    summary: 'Get game data',
    tags: ['Betting'],
    operationId: 'getGame',
    request: {
      query: z.object({
        address: z.string().optional(),
      }),
    },
  })
  @Get('/game')
  async getGame(ctx: Context): Promise<void> {
    const game = await getGame(ctx.query as any)
    if (game) success(ctx, game)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }

  @routeConfig({
    method: 'get',
    path: '/betting',
    summary: 'Get betting data',
    description: 'Get betting data',
    tags: ['Betting'],
    operationId: 'getBetting',
    request: {
      query: z.object({
        address: z.string().optional(),
      }),
    },
  })
  @Get('/betting')
  async getBettingList(ctx: Context): Promise<void> {
    const bettings = await getBetting(ctx.query as any)
    if (bettings) success(ctx, bettings)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }

  @routeConfig({
    method: 'post',
    path: '/betting',
    summary: 'Do betting',
    description: 'Do betting',
    tags: ['Betting'],
    operationId: 'postBetting',
    requestBody: {
      description: 'post betting',
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
              game_id: {
                type: 'number',
                description: 'The id of the game'
              },
              position: {
                type: 'number',
                description: 'The position of the user'
              },
              eggs: {
                type: 'number',
                description: 'The eggs of the user'
              },
            },
            required: ['game_id', 'address', 'winner_position', 'eggs']
          }
        },
      }
    }
  })
  @Post('/betting')
  async postBetting(ctx: Context): Promise<void> {
    success(ctx, await postBetting(ctx.request.body as any))
  }
}