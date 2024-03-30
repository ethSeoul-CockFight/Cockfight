// view functions for vip

import { BCS } from '@initia/initia.js'
import { config } from 'config'
import { CONTRACT_HEX_ADDRESS, CONTRACT_MODULE_NAME } from './constants'

export const bcs = BCS.getInstance()

export interface ModuleResponse {
  total_chickens: string
  chicken_price: string
  egg_price: string
  chickens: string
  eggs: string
  cock_fights: string
}

export async function getModuleStore(
): Promise<ModuleResponse> {
  const res = await config.l1lcd.move.viewFunction<any>(
    CONTRACT_HEX_ADDRESS,
    CONTRACT_MODULE_NAME,
    'get_module_store',
    [],
    []
  )
  return res
}

export async function getUserChickens(
  address: string
): Promise<ModuleResponse> {
    const res = await config.l1lcd.move.viewFunction<any>(
      CONTRACT_HEX_ADDRESS,
      CONTRACT_MODULE_NAME,
      'get_user_chickens',
      [],
      [
        bcs.serialize('address', address)
      ]
    )
    return res
}