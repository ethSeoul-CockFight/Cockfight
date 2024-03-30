import { APIError, ErrorTypes } from 'lib/error'
import { GameEntity, getDB } from 'orm'

export interface GetGameListParam {
  game_id?: number
}

interface GetGameListResponse {
  games: GameEntity[]
}

export async function getGameList(
  param: GetGameListParam
): Promise<GetGameListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      GameEntity,
      'game'
    )
    
    if (param.game_id) qb.where('game.gameId = :gameId', { gameId: param.game_id })
    const games = await qb.getMany()
    if (games.length === 0) throw new APIError(ErrorTypes.NOT_FOUND_ERROR, 'games not found')

    return {
      games,
    }
  } finally {
    await queryRunner.release()
  }
}