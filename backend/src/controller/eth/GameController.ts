import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getGameList } from 'service/GameService'


@Controller('')
export class GameController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/game',
    summary: 'Get game data',
    tags: ['Game'],
    operationId: 'getGame',
    request: {
        query: z.object({
            game_id: z.number().optional(),
        }),
    }
  })
  @Get('/game')
  async getGameList(ctx: Context): Promise<void> {
    const games = await getGameList(ctx.query as any)
    if (games) success(ctx, games)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }
}