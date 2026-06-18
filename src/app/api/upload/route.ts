import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const { guestId, imageBase64 } = await req.json()
  if (!guestId || !imageBase64) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  await kv.set(`img:${guestId}`, imageBase64)
  return NextResponse.json({ ok: true, url: `/api/upload?id=${guestId}` })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  const data = await kv.get<string>(`img:${id}`)
  if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const [meta, base64] = data.split(',')
  const mimeMatch = meta.match(/data:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const buffer = Buffer.from(base64, 'base64')
  return new Response(buffer, {
    headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=86400' },
  })
}
