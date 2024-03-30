import { AccAddress, BCS, MsgExecute } from "@initia/initia.js"
import { contract } from "./wallet"
import { bcs } from "./view"

export function setMerkleRoot(
    gameId: number,
    winnerPosition: number,
    merkleRoot: string
  ): MsgExecute {
    const msg = new MsgExecute(
        contract.key.accAddress,
        AccAddress.toHex(contract.key.accAddress),
        'cockfight',
        'set_merkle_root',
        [],
        [
          bcs.serialize(BCS.U64, gameId),
          bcs.serialize(BCS.U64, winnerPosition),
          bcs.serialize('vector<u8>', Buffer.from(merkleRoot, 'base64')),
        ]
    )
    return msg
  }