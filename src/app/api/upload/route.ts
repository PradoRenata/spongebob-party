import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS party_images (
      guest_id TEXT PRIMARY KEY,
      image_data TEXT NOT NULL
    )
  `
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { guestId, imageBase64 } = await req.json()
  if (!guestId || !imageBase64) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  await ensureTable()
  await sql`
    INSERT INTO party_images (guest_id, image_data) VALUES (${guestId}, ${imageBase64})
    ON CONFLICT (guest_id) DO UPDATE SET image_data = ${imageBase64}
  `
  return NextResponse.json({ ok: true, url: `/api/upload?id=${guestId}` })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  await ensureTable()
  const result = await sql`SELECT image_data FROM party_images WHERE guest_id = ${id}`
  if (result.rows.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const data = result.rows[0].image_data
  const [meta, base64] = data.split(',')
  const mimeMatch = meta.match(/data:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const buffer = Buffer.from(base64, 'base64')
  return new Response(buffer, {
    headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' },
  })
}
