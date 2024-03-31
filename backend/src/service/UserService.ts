import { UserEntity, getDB } from 'orm'

export interface GetUserParam {
  address: string
}

interface GetUsersResponse {
  users: UserEntity[]
}

export async function getUsers(param: GetUserParam): Promise<GetUsersResponse> {
  const [db] = getDB()
  const queryRunner = db.createQueryRunner('slave')
  console.log(param)
  try {
    const qb = queryRunner.manager.createQueryBuilder(
      UserEntity,
      'user'
    )
    
    if (param.address) qb.where('user.address = :address', { address: param.address })
    
    const users = await qb.getMany()
    console.log(users, param.address)
    if (users.length == 0) throw new Error('user not found')

    return {
      users
    }
  } finally {
    await queryRunner.release()
  }
}