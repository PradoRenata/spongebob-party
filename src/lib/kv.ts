import { sql } from '@vercel/postgres'
import { AppData, PartyInfo, Guest } from './types'

const DEFAULT_DATA: AppData = {
  party: { fecha: '', hora: '', lugar: '', mensaje: '' },
  guests: [],
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS party_data (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `
}

export async function getData(): Promise<AppData> {
  await ensureTable()
  const result = await sql`SELECT value FROM party_data WHERE key = 'main'`
  if (result.rows.length === 0) return DEFAULT_DATA
  return JSON.parse(result.rows[0].value)
}

export async function setData(data: AppData): Promise<void> {
  await ensureTable()
  const value = JSON.stringify(data)
  await sql`
    INSERT INTO party_data (key, value) VALUES ('main', ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `
}

export async function updateParty(party: PartyInfo): Promise<void> {
  const data = await getData()
  await setData({ ...data, party })
}

export async function updateGuests(guests: Guest[]): Promise<void> {
  const data = await getData()
  await setData({ ...data, guests })
}
