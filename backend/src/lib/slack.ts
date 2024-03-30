import { Wallet } from '@initia/initia.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import http from 'http'
import https from 'https'

const { SLACK_WEB_HOOK } = process.env

export function buildNotEnoughBalanceNotification(
  wallet: Wallet,
  balance: number,
  denom: string
): { text: string } {
  let notification = '```'
  notification += `[WARN] Enough Balance Notification\n`
  notification += `\n`
  notification += `Endpoint: ${wallet.lcd.URL}\n`
  notification += `Address : ${wallet.key.accAddress}\n`
  notification += `Balance : ${new BigNumber(balance)
    .div(1e6)
    .toFixed(6)} ${denom}\n`
  notification += '```'
  const text = `${notification}`
  return {
    text,
  }
}

export function buildFailedSnapshotNotification(
  bridgeId: string,
  stage: number,
  errMsg: string
): { text: string } {
  let notification = '```'
  notification += `[WARN] Failed Snapshot Notification\n`
  notification += `\n`
  notification += `Bridge ID: ${bridgeId}\n`
  notification += `Stage: ${stage}\n`
  notification += `Error: ${errMsg}\n`
  notification += '```'
  const text = `${notification}`
  return {
    text,
  }
}

export function buildSubmissionFailNotification(
  stage: number,
  errMsg: string
): {
  text: string
} {
  let notification = '```'
  notification += `[WARN] Submission Fail Notification\n`
  notification += `\n`
  notification += `Stage: ${stage}\n`
  notification += `Error: ${errMsg}\n`
  notification += '```'
  const text = `${notification}`
  return {
    text,
  }
}

const ax = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  timeout: 15000,
})

export async function notifySlack(text: { text: string }) {
  if (SLACK_WEB_HOOK == undefined || SLACK_WEB_HOOK == '') return
  await ax.post(SLACK_WEB_HOOK, text).catch(() => {
    console.error('Slack Notification Error')
  })
}
