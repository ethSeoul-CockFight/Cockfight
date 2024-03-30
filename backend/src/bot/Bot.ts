/* eslint-disable @typescript-eslint/no-unused-vars */
import { delay } from "bluebird"
import { config } from "config"
import { getDB } from "orm"
import { DataSource, EntityManager } from "typeorm"

export abstract class Bot {
    protected db: DataSource
    protected isRunning: boolean
    protected nextFeedTs: Date

    constructor() {
      ;[this.db] = getDB()
      this.isRunning = true
    }
  
    public stop() {
      this.isRunning = false
    }
  
    public async run(): Promise<void> {
      while (this.isRunning) {
        try {
          await this.db.transaction(async (manager: EntityManager) => {
            await this.process(manager)
          })
        } catch (err) {
          console.log(err)
          this.stop()
        } finally {
          await delay(config.UPDATE_INTERVAL)
        }
      }
    }
  
    public async process(
      manager: EntityManager,
    ): Promise<any> {}
  }
  