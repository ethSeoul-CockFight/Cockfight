import { Context } from 'koa'
import { KoaController, Get, Controller } from 'koa-joi-controllers'
import { routeConfig, z } from 'koa-swagger-decorator'
import { ErrorTypes } from 'lib/error'
import { success, error } from 'lib/response'
import { getUsers } from 'service/UserService'

@Controller('')
export class UserController extends KoaController {
  @routeConfig({
    method: 'get',
    path: '/user',
    summary: 'Get user data',
    tags: ['User'],
    operationId: 'getUser',
    request: {
      query: z.object({
        address: z.string().optional(),
      }),
    },
  })
  @Get('/user')
  async getUsers(ctx: Context): Promise<void> {
    const users = await getUsers(ctx.query as any)
    if (users) success(ctx, users)
    else error(ctx, ErrorTypes.NOT_FOUND_ERROR)
  }
}