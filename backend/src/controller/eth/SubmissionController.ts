import { Context } from 'koa'
import { KoaController, Post, Controller } from 'koa-joi-controllers'
import { routeConfig } from 'koa-swagger-decorator'
import { success } from 'lib/response'
import { postGame, postGameResult } from 'service/SubmissionService'

@Controller('')
export class SubmissionController extends KoaController {
  @routeConfig({
    method: 'post',
    path: '/submission/game',
    summary: 'Do submission game ',
    tags: ['Submission'],
    operationId: 'postGame',
    requestBody: {
      description: 'post submission',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              game_id: {
                type: 'number',
                description: 'The id of the game'
              },
              position_number: {
                type: 'number',
                description: 'The position number of the game'
              },
              winner_position: {
                type: 'number',
                description: 'The position of the winner'
              },
            },
            required: ['game_id', 'position_number', 'winner_position']
          }
        },
      }
    }
  })
  @Post('/submission/game')
  async postGame(ctx: Context): Promise<void> {
    success(ctx, await postGame(ctx.request.body as any))
  }

  @routeConfig({
    method: 'post',
    path: '/submission/result',
    summary: 'Do submission result',
    tags: ['Submission'],
    operationId: 'postGameResult',
    requestBody: {
      description: 'post submission',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              game_id: {
                type: 'number',
                description: 'The id of the game'
              },
              winner_position: {
                type: 'number',
                description: 'The position of the winner'
              },
            },
            required: ['game_id', 'winner_position']
          }
        },
      }
    }
  })
  @Post('/submission/result')
  async postGameResult(ctx: Context): Promise<void> {
    success(ctx, await postGameResult(ctx.request.body as any))
  }
}

