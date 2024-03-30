import { APIError, ErrorTypes } from 'lib/error'
import { BettingEntity, GameEntity, getDB } from 'orm'
import { getCurrentTimeSecond } from './MarketService';

interface GetGameParam {
  game_id?: number
}

interface GetGameResponse {
  game: GameEntity
}

function generateRandomFourDigitNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

async function createNewGame(gameId: number): Promise<GameEntity> {
  // Assuming GameEntity is a class you have defined
  const newGame = new GameEntity();
  newGame.game_id = gameId;
  newGame.winner_position = generateRandomFourDigitNumber();
  newGame.end_time = getCurrentTimeSecond() + 60;
  newGame.is_ended = false;
  // Here you would save the newGame to the database
  // For example: await queryRunner.manager.save(newGame);
  return newGame;
}

export async function getGame(param: GetGameParam): Promise<GetGameResponse> {
  const [db] = getDB();
  const queryRunner = db.createQueryRunner('slave');

  try {
    let game: GameEntity | null = null;

    if (param.game_id) {
      game = await queryRunner.manager
        .createQueryBuilder(GameEntity, 'game')
        .where('game.game_id = :gameId', { gameId: param.game_id })
        .getOne();

      if (game) {
        return { game };
      }
    }

    const mostRecentGame = await queryRunner.manager
      .createQueryBuilder(GameEntity, 'game')
      .orderBy('game.game_id', 'DESC')
      .getOne();

    console.log(mostRecentGame, getCurrentTimeSecond())
    // If no game exists at all, create the first game
    if (!mostRecentGame) {
      const newGame = await createNewGame(1);
      await queryRunner.manager.save(newGame);
      return { game: newGame };
    }

    if (mostRecentGame.end_time < getCurrentTimeSecond()) {
      // Ensure the game is marked as ended and saved, in case it wasn't already
      if (!mostRecentGame.is_ended) {
        mostRecentGame.is_ended = true;
        await queryRunner.manager.save(mostRecentGame);
      }
      
      // Create a new game with the next sequential game_id
      const newGame = await createNewGame(mostRecentGame.game_id + 1);
      await queryRunner.manager.save(newGame);
      return { game: newGame };
    }

    // If the most recent game is still active, return it
    return { game: mostRecentGame };
  } catch (error) {
    console.error('Failed to get or create game:', error);
    throw error; // rethrow the error after logging it
  } finally {
    await queryRunner.release();
  }
}

interface GetBettingParam {
  address: string
}

interface GetBettingResponse {
  betting: BettingEntity
}

export async function getBetting(
  param: GetBettingParam
): Promise<GetBettingResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const lastBetting = await queryRunner.manager.createQueryBuilder(
      BettingEntity,
      'betting'
    ).orderBy('betting.id', 'DESC')
    .where('betting.address = :address', { address: param.address })
    .getOne()

    if (!lastBetting) throw new APIError(ErrorTypes.NOT_FOUND_ERROR, 'betting not found')

    return {
      betting: lastBetting
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
    const betting = await queryRunner
      .manager
      .getRepository(BettingEntity)
      .findOne({
        where: {
          address: req.address,
          gameId: req.game_id,
        },
      })
    
    let egg = req.eggs
    if (betting) egg = betting.eggs

    await queryRunner
      .manager
      .getRepository(BettingEntity)
      .save({
        address: req.address,
        gameId: req.game_id,
        position: req.position,
        eggs: egg,
      })

  } finally {
    await queryRunner.release()
  }
}