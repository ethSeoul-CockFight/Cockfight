import { UserEntity, getDB } from "orm"


interface GetTotalEggsResponse {
    total_eggs: number
}
  
export async function getTotalEggs(): Promise<GetTotalEggsResponse> {
    const [db] = getDB()
    const queryRunner = db.createQueryRunner('slave')
  
    try {
      const qb = queryRunner.manager.createQueryBuilder(
        UserEntity,
        'user'
      )
      
      const users = await qb
        .getMany()
  
      if (users.length == 0) throw new Error('user not found')
    
      const total_eggs = users.reduce((acc, user) => acc + user.egg, 0)
      return {
        total_eggs
      }
    } finally {
      await queryRunner.release()
    }
}