import { runBot } from 'bot'
import { apiLogger as logger } from 'lib/logger'
import { initServer, finalizeServer } from 'loader'
import { once } from 'lodash'
import { initORM, finalizeORM } from 'orm'

async function gracefulShutdown(): Promise<void> {
  logger.info('Closing listening port')
  finalizeServer()

  logger.info('Closing DB connection')
  await finalizeORM()

  logger.info('Finished')
  process.exit(0)
}

export async function startBot(): Promise<void> {
  await initORM()
  await initServer()
  // await runBot()

  // attach graceful shutdown
  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const
  signals.forEach((signal) => process.on(signal, once(gracefulShutdown)))
}

if (require.main === module) {
  startBot().catch(console.log)
}
