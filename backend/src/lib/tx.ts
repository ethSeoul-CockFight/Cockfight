import { Msg, WaitTxBroadcastResult, Wallet } from '@initia/initia.js'
import { delay } from 'bluebird'

export async function sendTx(
  wallet: Wallet,
  msgs: Msg[],
  accountNumber?: number,
  sequence?: number,
  timeout = 10_000
): Promise<WaitTxBroadcastResult> {
  const signedTx = await wallet.createAndSignTx({
    msgs,
    accountNumber,
    sequence,
  })
  const broadcastResult = await wallet.lcd.tx.broadcast(signedTx, timeout)
  if (broadcastResult['code']) throw new Error(broadcastResult.raw_log)
  return broadcastResult
}

export async function checkTx(
  lcd: any,
  txHash: string,
  timeout = 60000
): Promise<any> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeout) {
    try {
      const txInfo = await lcd.tx.txInfo(txHash)
      if (txInfo) return txInfo
      await delay(1000)
    } catch (err) {
      throw new Error(`Failed to check transaction status: ${err.message}`)
    }
  }

  throw new Error('Transaction checking timed out')
}
