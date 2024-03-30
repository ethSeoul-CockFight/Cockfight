import { config } from 'config'

// targetTime = new Date('2023-12-03T06:23:38.540560Z');
export async function getSnapshotHeight(snapshotTime: Date): Promise<number> {
  const latestBlock = await config.l1lcd.tendermint.blockInfo()
  let leftBlockHeight = 1
  let rightBlockHeight = parseInt(latestBlock.block.header.height)
  let midBlockHeight, midBlock, mid
  let closestBlockHeight = 0

  while (leftBlockHeight <= rightBlockHeight) {
    midBlockHeight = Math.floor((leftBlockHeight + rightBlockHeight) / 2)
    midBlock = await config.l1lcd.tendermint.blockInfo(midBlockHeight)
    mid = new Date(midBlock.block.header.time)

    if (mid < snapshotTime) {
      closestBlockHeight = midBlockHeight
      leftBlockHeight = midBlockHeight + 1
    } else if (mid > snapshotTime) {
      rightBlockHeight = midBlockHeight - 1
    } else {
      closestBlockHeight = midBlockHeight
      break
    }
  }
  return closestBlockHeight
}
