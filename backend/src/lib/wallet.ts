import { config } from 'config'
import {
  MnemonicKey,
  Wallet,
  Msg,
  LCDClient,
  Key,
  Coins,
  WaitTxBroadcastResult,
} from '@initia/initia.js'
import { sendTx } from './tx'
import { buildNotEnoughBalanceNotification, notifySlack } from './slack'

export class TxWallet extends Wallet {
  private managedAccountNumber
  private managedSequence

  constructor(lcd: LCDClient, key: Key) {
    super(lcd, key)
  }

  async checkEnoughBalance() {
    const gasPrices = new Coins(this.lcd.config.gasPrices)
    const denom = gasPrices.denoms()[0]

    const balance = await this.lcd.bank.balanceByDenom(
      this.key.accAddress,
      denom
    )

    if (balance.amount && parseInt(balance.amount) < 10_000_000) {
      await notifySlack(
        buildNotEnoughBalanceNotification(this, parseInt(balance.amount), denom)
      )
    }
  }

  async transaction(msgs: Msg[]): Promise<WaitTxBroadcastResult> {
    if (!this.managedAccountNumber && !this.managedSequence) {
      const { account_number: accountNumber, sequence } =
        await this.accountNumberAndSequence()
      this.managedAccountNumber = accountNumber
      this.managedSequence = sequence
    }

    try {
      await this.checkEnoughBalance()
      const txInfo = await sendTx(
        this,
        msgs,
        this.managedAccountNumber,
        this.managedSequence
      )
      this.managedSequence += 1
      return txInfo
    } catch (err) {
      delete this.managedAccountNumber
      delete this.managedSequence
      throw err
    }
  }
}

export const contract = new TxWallet(
  config.l1lcd,
  new MnemonicKey({
    mnemonic: config.CONTRACT_MNEMONIC,
  })
)

export const faucet = new TxWallet(
  config.l1lcd,
  new MnemonicKey({
    mnemonic: config.CONTRACT_MNEMONIC,
  })
)