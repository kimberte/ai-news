// app/api/news/route.ts

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? 'general'
  const country = searchParams.get('country') ?? 'us'

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return NextResponse.json([])
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/news?category=eq.${category}&country=eq.${country}&order=published_at.desc&limit=20`,
    {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}
