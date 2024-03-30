import { MsgSend } from "@initia/initia.js"
import { contract } from "lib/wallet"

export async function getInitiaFaucetToken(address: string, amount: number) {
    const msg = new MsgSend(
        contract.key.accAddress,
        address,
        { uinit: amount }
    )
    return await contract.transaction([msg])
}