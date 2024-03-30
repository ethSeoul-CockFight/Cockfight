import { SHA3 } from 'sha3'
import { random } from 'lodash'
import { INIT_ACCOUNT_REGEX } from './constants'
import { AccAddress } from '@initia/initia.js'

export function sha3_256(value: Buffer | string | number) {
  value = toBuffer(value)

  return new SHA3(256).update(value as Buffer).digest()
}

function toBuffer(value: any) {
  if (!Buffer.isBuffer(value)) {
    if (Array.isArray(value)) {
      value = Buffer.from(value)
    } else if (typeof value === 'string') {
      if (isHexString(value)) {
        value = Buffer.from(padToEven(stripHexPrefix(value)), 'hex')
      } else {
        value = Buffer.from(value)
      }
    } else if (typeof value === 'number') {
      value = intToBuffer(value)
    } else if (value === null || value === undefined) {
      value = Buffer.allocUnsafe(0)
    } else if (value.toArray) {
      // converts a BN to a Buffer
      value = Buffer.from(value.toArray())
    } else {
      throw new Error('invalid type')
    }
  }

  return value
}

function isHexString(value: any, length?: number) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }

  if (length && value.length !== 2 + 2 * length) {
    return false
  }

  return true
}

function padToEven(value: any) {
  if (typeof value !== 'string') {
    throw new Error(
      `while padding to even, value must be string, is currently ${typeof value}, while padToEven.`
    )
  }

  if (value.length % 2) {
    value = `0${value}`
  }

  return value
}

function stripHexPrefix(value: any) {
  if (typeof value !== 'string') {
    return value
  }

  return isHexPrefixed(value) ? value.slice(2) : value
}

function isHexPrefixed(value: any) {
  if (typeof value !== 'string') {
    throw new Error(
      "value must be type 'string', is currently type " +
        typeof value +
        ', while checking isHexPrefixed.'
    )
  }

  return value.slice(0, 2) === '0x'
}

function intToBuffer(i: number) {
  const hex = intToHex(i)
  return Buffer.from(padToEven(hex.slice(2)), 'hex')
}

function intToHex(i: number) {
  const hex = i.toString(16)
  return `0x${hex}`
}

export function getRandomDelay(startTs: number, endTs: number): number {
  return random(startTs, endTs, false) - startTs
}

export function stripQuotes(str: string): string {
  const strippedStr = str.replace(/^"|"$/g, '')
  return strippedStr
}

export function convertBigintStringToNumber(str: string): number {
  const res = Number(BigInt(str))
  return res
}

export function toHex(account: string): string {
  if (!INIT_ACCOUNT_REGEX.test(account)) {
    throw new Error('Invalid account format: ' + account)
  }

  const hexAccount = account.startsWith('init1')
    ? AccAddress.toHex(account)
    : account

  return '0x' + hexAccount.substring(2).replace(/^0+/, '')
}
