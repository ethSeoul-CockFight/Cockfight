import Bluebird from 'bluebird'
import {
  LCDClient,
  TableEntry,
  AccAddress,
  Resource,
  Pagination,
  PaginationOptions,
  APIParams,
} from '@initia/initia.js'
import { BASE_64_REGEX } from './constants'

export async function getResource<T>(
  lcd: LCDClient,
  address: AccAddress,
  structTag: string,
  maxRetries = 60,
  retryInterval = 1000
): Promise<{ type: string; data: T } | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await lcd.apiRequester.get<{ resource: Resource }>(
        `/initia/move/v1/accounts/${address}/resources/by_struct_tag`,
        { struct_tag: structTag },
      )
      return res.resource ? JSON.parse(res.resource.move_resource) : undefined
    } catch (e) {
      if ((e.response?.data?.message as string).includes('not found'))
        return undefined
      if (i === maxRetries - 1) throw e
      await Bluebird.delay(retryInterval)
    }
  }
}

export async function getTableEntry(
  lcd: LCDClient,
  address: string,
  keyBytes: string,
  height: number,
  params: Partial<PaginationOptions & APIParams> = {},
  maxRetries = 60,
  retryInterval = 1000
): Promise<TableEntry | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await lcd.apiRequester.get<{
        table_entry: TableEntry
      }>(
        `/initia/move/v1/tables/${address}/entries/by_key_bytes`,
        {
          ...params,
          key_bytes: BASE_64_REGEX.test(keyBytes)
            ? keyBytes
            : encodeURIComponent(keyBytes),
        },
        {
          'x-cosmos-block-height': height,
          accept: 'application/json',
        }
      )
      return res ? res.table_entry : undefined
    } catch (e) {
      if (i === maxRetries - 1) throw e
      if (e.response?.data?.code === 2) return undefined
      await Bluebird.delay(retryInterval)
    }
  }
}

export async function getTableEntries(
  lcd: LCDClient,
  address: string,
  params: Partial<PaginationOptions & APIParams> = {},
  maxRetries = 60,
  retryInterval = 1000
): Promise<[TableEntry[], Pagination] | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await lcd.apiRequester.get<{
        table_entries: TableEntry[]
        pagination: Pagination
      }>(`/initia/move/v1/tables/${address}/entries`, params)
      return res ? [res.table_entries, res.pagination] : undefined
    } catch (e) {
      if (i === maxRetries - 1) throw e
      await Bluebird.delay(retryInterval)
    }
  }
}

export async function getAllTableEntries(
  lcd: LCDClient,
  tableHandle: string,
): Promise<TableEntry[]> {
  let entries: TableEntry[] = []
  let nextKey: string | undefined = ''

  while (nextKey !== undefined) {
    const params = { ...(nextKey && { 'pagination.key': nextKey }) }
    const [res, pagination] = (await getTableEntries(
      lcd,
      tableHandle,
      params
    )) ?? [[], {}]
    entries = entries.concat(res)
    nextKey = pagination.next_key ?? undefined
  }

  return entries
}
