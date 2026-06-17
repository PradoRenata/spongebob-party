import { NextRequest, NextResponse } from 'next/server'
import { getData, setData } from '@/lib/kv'

export async function GET() {
  const data = await getData()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const body = await req.json()
  await setData(body)
  return NextResponse.json({ ok: true })
}
