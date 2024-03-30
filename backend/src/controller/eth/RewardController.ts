import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getTotalEggs } from 'service'


@Controller('')
export class RewardController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/reward',
    summary: 'Get total eggs',
    tags: ['Reward'],
    operationId: 'getTotalEggs',
  })
  @Get('/reward')
  async getUser(ctx: Context): Promise<void> {
    const users = await getTotalEggs()
    if (users) success(ctx, users)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }
}