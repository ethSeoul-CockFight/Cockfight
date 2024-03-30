import { BCS } from '@initia/initia.js'
import { convertBigintStringToNumber, sha3_256 } from './util'

const bcs = BCS.getInstance()
const REWARD_PREFIX = 0xf3
const OBJECT_FROM_SEED_ADDRESS_SCHEME = 0xfe

export function normalize(addr: string) {
  return addr.startsWith('0x') ? addr : '0x' + addr.replace(/^0+/, '')
}

export function computeCoinMetadata(creator: string, symbol: string): string {
  const addrBytes = Buffer.from(bcs.serialize(BCS.ADDRESS, creator), 'base64')
  const seed = Buffer.from(symbol, 'ascii')
  const combinedBytes = [...addrBytes, ...seed, OBJECT_FROM_SEED_ADDRESS_SCHEME]

  const hash = sha3_256(Buffer.from(combinedBytes))
  return hash.toString('hex')
}

export function computeRewardAddress(
  operator: string,
  bridgeId: string
): string {
  const bridgeIdNumber = convertBigintStringToNumber(bridgeId)
  const addrBytes = Buffer.from(bcs.serialize(BCS.ADDRESS, '0x1'), 'base64')
  const combinedSeed = [
    REWARD_PREFIX,
    ...Buffer.from(bcs.serialize(BCS.ADDRESS, operator), 'base64'),
    ...Buffer.from(bcs.serialize(BCS.U64, bridgeIdNumber), 'base64'),
  ]
  const combinedBytes = [
    ...addrBytes,
    ...combinedSeed,
    OBJECT_FROM_SEED_ADDRESS_SCHEME,
  ]

  const hash = sha3_256(Buffer.from(combinedBytes))

  return normalize(hash.toString('hex'))
}

export function computeL2Metadata(
  bridgeAddress: string,
  metadata: string
): string {
  const hash = sha3_256(
    Buffer.concat([
      Buffer.from(bcs.serialize(BCS.ADDRESS, bridgeAddress), 'base64'),
      Buffer.from(bcs.serialize(BCS.OBJECT, metadata), 'base64'),
    ])
  )

  return hash.toString('hex')
}
