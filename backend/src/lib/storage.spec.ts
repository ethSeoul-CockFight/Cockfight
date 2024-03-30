import { BettingStorage } from './storage'
import { Betting } from '../types'

describe('BettingStorage', () => {
  const bettings: Betting[] = [
    {
      address: '0x19c9b6007d21a996737ea527f46b160b0a057c37',
      gameId: 1,
      position: 1,
      eggs: 100,
    },
    {
      address: '0x70705e5336c47b20be2bc1f09a9e12db738dd7fb',
      gameId: 1,
      position: 2,
      eggs: 100,
    },
    {
      address: '0xe2db05674e6bd09ae1ba19461a475a5460b3b74b',
      gameId: 1,
      position: 3,
      eggs: 300,
    },
  ]

  const bettingStorage = new BettingStorage(bettings)

  it('should get the correct merkle root', () => {
    const merkleRoot = bettingStorage.getMerkleRoot()
    const merkleRootHex = Buffer.from(merkleRoot, 'base64').toString('hex')
    expect(merkleRootHex).toBe(
      '7244abd4541e1568f3a9a50d5d35f5eb6de88953673427b0e9c3c76c89baf293'
    )
  })

  it('should get the merkle proof for a betting', () => {
    const betting = bettings[0]
    const merkleProof = bettingStorage.getMerkleProof(betting)
    const merkleProofHex = merkleProof.map((p) =>
      Buffer.from(p, 'base64').toString('hex')
    )
    expect(merkleProofHex).toEqual([
      'ad171b1ba214f0faf0f876b09408e3c1c66d6e98998fc4a323b7d81760603411',
      'f464d740f1501cc8aee201b2c05e6b6904b38b1708cd6866d47fe81c0f828f41',
    ])
  })

  it('should verify the merkle proof for a betting', () => {
    const betting = bettings[0]
    const merkleProof = bettingStorage.getMerkleProof(betting)
    const isValid = bettingStorage.verify(merkleProof, betting)
    expect(isValid).toBe(true)
  })
})
