import { UserEntity, getDB } from 'orm'

export interface GetUserParam {
  address: string
}

interface GetUserResponse {
  users: UserEntity[]
}

export async function getUser(
  param: GetUserParam
): Promise<GetUserResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')

  try {
    const qb = queryRunner.manager.createQueryBuilder(
      UserEntity,
      'user'
    )
    
    if (param.address) qb.where('user.address = :address', { address: param.address })
    const users = await qb.getMany()

    if (users.length == 0) throw new Error('user not found')

    return {
      users
    }
  } finally {
    await queryRunner.release()
  }
}
