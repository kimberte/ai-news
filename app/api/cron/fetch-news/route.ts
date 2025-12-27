import { NextResponse } from 'next/server'
import { fetchAndStoreNews } from '@/app/lib/fetchAndStoreNews'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const result = await fetchAndStoreNews()
    return NextResponse.json({ ok: true, result })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }
}
