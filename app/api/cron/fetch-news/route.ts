// app/api/cron/fetch-news/route.ts

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Article = {
  title: string
  description: string
  url: string
  source: string
  published_at: string
  category: string
  country: string
}

export async function GET() {
  // 🔐 Prevent build-time crashes
  if (
    !process.env.NEWS_API_KEY ||
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.warn('Missing env vars — skipping fetch-news cron')
    return NextResponse.json({ skipped: true })
  }

  const newsApiUrl =
    `https://newsapi.org/v2/top-headlines` +
    `?country=us&category=general&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`

  const newsRes = await fetch(newsApiUrl)
  const newsJson = await newsRes.json()

  if (!newsJson.articles) {
    return NextResponse.json({ error: 'No articles returned' }, { status: 500 })
  }

  const articles: Article[] = newsJson.articles.map((a: any) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name ?? 'Unknown',
    published_at: a.publishedAt,
    category: 'general',
    country: 'us',
  }))

  const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/news`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(articles),
  })

  if (!supabaseRes.ok) {
    const text = await supabaseRes.text()
    console.error(text)
    return NextResponse.json({ error: 'Supabase insert failed' }, { status: 500 })
  }

  return NextResponse.json({ inserted: articles.length })
}
