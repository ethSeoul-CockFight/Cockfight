import { Retry } from './decorator'
import {
  getModuleStore,
} from './view'

export const getModuleStoreWithRetry = Retry(getModuleStore)

