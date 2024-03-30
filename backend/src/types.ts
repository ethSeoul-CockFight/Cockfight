import { AccAddress } from '@initia/initia.js'

export interface Table {
  handle: string
  length: string
}

export interface Betting {
  address: AccAddress
  gameId: number
  position: number
  eggs: number
}