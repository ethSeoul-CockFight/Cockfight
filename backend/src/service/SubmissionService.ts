import { BettingEntity, GameEntity, getDB } from 'orm'
import { Betting } from 'types'
import { BettingStorage } from 'lib/storage'
import { APIError, ErrorTypes } from 'lib/error'
import { contract } from 'lib/wallet'
import { setMerkleRoot } from 'lib/merkleRoot'

export interface PostGameParam {
  game_id: number
  position_num : number
  prize_amount: number
}

export async function postGame(param: PostGameParam) {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const gameId = Number(param.game_id)
    const game =await queryRunner
      .manager
      .getRepository(GameEntity)
      .findOne({
        where: {
          gameId
        },
      })

    if (game) throw new APIError(ErrorTypes.INVALID_REQUEST_ERROR, 'game already exists')
    await queryRunner.manager.getRepository(GameEntity).save({
      gameId,
      positionNum: param.position_num,
      prizeAmount: param.prize_amount,
    })

  } finally {
    await queryRunner.release()
  }
}


export interface PostGameResultParam {
  game_id: number
  winner_position: number
}

export async function postGameResult(param: PostGameResultParam) {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const gameId = Number(param.game_id)
    const game =await queryRunner
      .manager
      .getRepository(GameEntity)
      .findOne({
        where: {
          gameId
        },
      })

    if (!game) throw new APIError(ErrorTypes.INVALID_REQUEST_ERROR, 'game not exists')
    
    const bettingQb = await queryRunner
      .manager
      .createQueryBuilder(BettingEntity,'betting')
      .where('betting.game_id = :gameId', {
        gameId: game.gameId,
      })
      .getMany()
    
    const bettings: Betting[]  = bettingQb.map((entity)=> {
      return {
        address: entity.address,
        gameId: entity.gameId,
        position: entity.position,
        eggs: entity.eggs,
      }
    })
    
    const bettingStorage = new BettingStorage(bettings)
    const bettingMerkleRoot = bettingStorage.getMerkleRoot()

    for (const betting of bettings) {
      await queryRunner.manager.getRepository(BettingEntity)
        .save({
          address: betting.address,
          gameId: betting.gameId,
          position: betting.position,
          eggs: betting.eggs,
          merkleRoot: bettingMerkleRoot,
          merkleProof: bettingStorage.getMerkleProof(betting),
        })
    }

    if (bettings.length === 0) return
    
    await contract.transaction([
      setMerkleRoot(
        game.gameId,
        Number(param.winner_position),
        bettingMerkleRoot,
      )
    ])

  } finally {
    await queryRunner.release()
  }
}
