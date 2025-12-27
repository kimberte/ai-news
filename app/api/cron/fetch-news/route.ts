// app/api/cron/fetch-news/route.ts

import { NextResponse } from 'next/server'
import { fetchAndStoreNews } from '@/lib/fetchAndStoreNews'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    // Optional security check
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const result = await fetchAndStoreNews()

    return NextResponse.json({
      success: true,
      inserted: result.inserted,
    })
  } catch (error) {
    console.error('Cron fetch failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
