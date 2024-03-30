import { APIError, ErrorTypes } from 'lib/error'
import { BettingEntity, UserEntity, getDB } from 'orm'

export interface GetBettingListParam {
  game_id?: number
  address?: string
}

interface GetBettingListResponse {
  bettings: BettingEntity[]
}

export async function getBettingList(
  param: GetBettingListParam
): Promise<GetBettingListResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      BettingEntity,
      'betting'
    )

    if (param.game_id) qb.where('betting.gameId = :gameId', { gameId: param.game_id })
    if (param.address) qb.where('betting.address = :address', { address: param.address })
    const bettings = await qb.getMany()
    if (bettings.length === 0) throw new APIError(ErrorTypes.NOT_FOUND_ERROR, 'bettings not found')

    return {
      bettings,
    }
  } finally {
    await queryRunner.release()
  }
}

interface PostBettingParam {
  address: string
  game_id: number
  position: number
  eggs: number
}

export async function postBetting(
  req: PostBettingParam
) {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const user = await queryRunner
      .manager
      .getRepository(UserEntity)
      .findOne({
        where: {
          address: req.address,
        }
      })
      
    if (!user) throw new APIError(ErrorTypes.NOT_FOUND_ERROR, 'user not found')
    if (user.egg < req.eggs) throw new APIError(ErrorTypes.NOT_FOUND_ERROR, 'user eggs not enough')

    const betting = await queryRunner
      .manager
      .getRepository(BettingEntity)
      .findOne({
        where: {
          address: req.address,
          gameId: req.game_id,
        },
      })
    
    let eggs = req.eggs
    if (betting) eggs += betting.eggs
    await queryRunner
      .manager
      .getRepository(UserEntity)
      .save({
        ...user,
        egg: user.egg - req.eggs,
      })

    await queryRunner
      .manager
      .getRepository(BettingEntity)
      .save({
        address: req.address,
        gameId: req.game_id,
        position: req.position,
        eggs: eggs,
      })

  } finally {
    await queryRunner.release()
  }
}