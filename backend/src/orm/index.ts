import 'reflect-metadata'
import Bluebird from 'bluebird'
import { ConnectionOptionsReader, DataSource, DataSourceOptions } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import CamelToSnakeNamingStrategy from './CamelToSnakeNamingStrategy'

import debugModule from 'debug'
const debug = debugModule('orm')

import { BettingEntity } from './BettingEntity'
import { MarketEntity } from './MarketEntity'
import { UserEntity } from './UserEntity'
import { GameEntity } from './GameEntity'
// import { DashboardEntity } from './DashboardEntity'
import { YieldPlanEntity } from './YieldPlanEntity'

export * from './BettingEntity'
export * from './MarketEntity'
export * from './UserEntity'
export * from './YieldPlanEntity'
export * from './GameEntity'
// export * from './DashboardEntity'

// import { AptosBettingEntity } from './aptos/AptosBettingEntity'
// import { AptosGameEntity } from './aptos/AptosGameEntity'
// import { AptosMarketEntity } from './aptos/AptosMarketEntity'
// import { AptosDashboardEntity } from './aptos/AptosDashboardEntity'
// import { AptosUserEntity } from './aptos/AptosUserEntity'
// export * from './aptos/AptosBettingEntity'
// export * from './aptos/AptosGameEntity'
// export * from './aptos/AptosMarketEntity'
// export * from './aptos/AptosDashboardEntity'
// export * from './aptos/AptosUserEntity'

export const staticOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  entities: [
    BettingEntity,
    GameEntity,
    MarketEntity,
    // DashboardEntity,
    UserEntity,
    YieldPlanEntity
  ],
}

let DB: DataSource[] = []

function initConnection(options: DataSourceOptions): Promise<DataSource> {
  const pgOpts = options as PostgresConnectionOptions
  debug(
    `creating connection default to ${pgOpts.username}@${pgOpts.host}:${
      pgOpts.port || 5432
    }`
  )

  return new DataSource({
    ...options,
    ...staticOptions,
    namingStrategy: new CamelToSnakeNamingStrategy() as any,
  }).initialize()
}

export async function initORM(host?: string, port?: number): Promise<void> {
  const reader = new ConnectionOptionsReader()
  const options = (await reader.all()) as PostgresConnectionOptions[]

  DB = await Bluebird.map(options, (opt) => {
    const newOptions = { ...opt }
    if (host) {
      newOptions.host = host
    }
    if (port) {
      newOptions.port = port
    }
    return initConnection(newOptions)
  })
}

export function getDB(): DataSource[] {
  if (!DB) {
    throw new Error('DB not initialized')
  }
  return DB
}

export async function finalizeORM(): Promise<void> {
  await Promise.all(DB.map((c) => c.destroy()))
}