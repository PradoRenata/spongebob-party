import { kv } from '@vercel/kv'
import { AppData, PartyInfo, Guest } from './types'

const KEY = 'party_data'

const DEFAULT_DATA: AppData = {
  party: { fecha: '', hora: '', lugar: '', mensaje: '' },
  guests: [],
}

export async function getData(): Promise<AppData> {
  const data = await kv.get<AppData>(KEY)
  return data ?? DEFAULT_DATA
}

export async function setData(data: AppData): Promise<void> {
  await kv.set(KEY, data)
}

export async function updateParty(party: PartyInfo): Promise<void> {
  const data = await getData()
  await setData({ ...data, party })
}

export async function updateGuests(guests: Guest[]): Promise<void> {
  const data = await getData()
  await setData({ ...data, guests })
}
