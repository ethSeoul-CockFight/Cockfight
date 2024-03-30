import { getAptosFaucetToken } from "./aptos/getFaucetToken"
import { getInitiaFaucetToken } from "./initia/getFaucetToken"
import { APIError, ErrorTypes } from "lib/error"

interface GetTokensParam {
    network: string,
    address: string,
    amount: number
}
  
export async function getTokens(
    req: GetTokensParam
) {
    const network = req.network
    const address = req.address
    const amount = req.amount
    try {
        if (network === 'aptos') return await getAptosFaucetToken(address, amount)
        if (network === 'initia') return await getInitiaFaucetToken(address, amount)
    } catch (err) {
        console.log(err)
        throw new APIError(ErrorTypes.API_ERROR, 'Failed to get tokens')
    }
}