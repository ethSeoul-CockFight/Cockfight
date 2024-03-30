import { MerkleTree } from 'merkletreejs'
import { BCS } from '@initia/initia.js'
import { sha3_256 } from './util'
import { Betting} from '../types'

function convertHexToBase64(hex: string): string {
  return Buffer.from(hex, 'hex').toString('base64')
}

export class BettingStorage {
  public bcs = BCS.getInstance()
  private tree: MerkleTree

  constructor(bettings: Betting[]) {
    const leaves = bettings.map((betting) => {
      return sha3_256(
        Buffer.concat([
          Buffer.from(this.bcs.serialize(BCS.ADDRESS, betting.address), 'base64'),
          Buffer.from(this.bcs.serialize(BCS.U64, betting.gameId), 'base64'),
          Buffer.from(this.bcs.serialize(BCS.U64, betting.position), 'base64'),
          Buffer.from(this.bcs.serialize(BCS.U64, betting.eggs), 'base64'),
        ])
      )
    })

    this.tree = new MerkleTree(leaves, sha3_256, { sort: true })
  }

  public getMerkleRoot(): string {
    return convertHexToBase64(this.tree.getHexRoot().replace('0x', ''))
  }

  public getMerkleProof(betting: Betting): string[] {
    return this.tree
      .getHexProof(
        sha3_256(
          Buffer.concat([
            Buffer.from(this.bcs.serialize(BCS.ADDRESS, betting.address), 'base64'),
            Buffer.from(this.bcs.serialize(BCS.U64, betting.gameId), 'base64'),
            Buffer.from(this.bcs.serialize(BCS.U64, betting.position), 'base64'),
            Buffer.from(this.bcs.serialize(BCS.U64, betting.eggs), 'base64'),
          ])
        )
      )
      .map((v) => convertHexToBase64(v.replace('0x', '')))
  }

  public verify(proof: string[], betting: Betting): boolean {
    let hashBuf = sha3_256(
      Buffer.concat([
        Buffer.from(this.bcs.serialize(BCS.ADDRESS, betting.address), 'base64'),
        Buffer.from(this.bcs.serialize(BCS.U64, betting.gameId), 'base64'),
        Buffer.from(this.bcs.serialize(BCS.U64, betting.position), 'base64'),
        Buffer.from(this.bcs.serialize(BCS.U64, betting.eggs), 'base64'),
      ])
    )

    for (const proofElem of proof) {
      const proofBuf = Buffer.from(proofElem, 'base64')

      hashBuf =
        Buffer.compare(hashBuf, proofBuf) === -1
          ? sha3_256(Buffer.concat([hashBuf, proofBuf]))
          : sha3_256(Buffer.concat([proofBuf, hashBuf]))
    }

    return this.getMerkleRoot() === hashBuf.toString('base64')
  }
}
