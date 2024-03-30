import { LCDClient } from '@initia/initia.js'
import dotenv from 'dotenv'

dotenv.config()

const {
  SERVER_PORT,
  L1_LCD_URI,
  L1_RPC_URI,
  PRIZE_AMOUNT,
  CONTRACT_MNEMONIC,
  USE_LOG_FILE,
  UPDATE_INTERVAL,
} = process.env

export const config = {
  SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 6000,
  L1_LCD_URI: L1_LCD_URI ? L1_LCD_URI.split(',') : ['https://lcd.stone-13.initia.xyz'],
  L1_RPC_URI: L1_RPC_URI ? L1_RPC_URI.split(',') : ['https://rpc.stone-13.initia.xyz'],
  CONTRACT_MNEMONIC: CONTRACT_MNEMONIC || '',
  PRIZE_AMOUNT: PRIZE_AMOUNT ? Number.parseInt(PRIZE_AMOUNT) : 100_000_000,
  l1lcd: new LCDClient(
    L1_LCD_URI ? L1_LCD_URI.split(',')[0] : 'https://lcd.stone-13.initia.xyz',
    {
      gasPrices: '0.15uinit',
      gasAdjustment: '1.75',
    }
  ),
  USE_LOG_FILE: USE_LOG_FILE === 'true' ? true : false,
  UPDATE_INTERVAL: UPDATE_INTERVAL ? parseInt(UPDATE_INTERVAL) : 10_000,
}