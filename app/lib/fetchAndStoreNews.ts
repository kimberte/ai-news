// app/lib/fetchAndStoreNews.ts

import { supabaseAdmin } from './supabaseAdmin'

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'

export async function fetchAndStoreNews() {
  const params = new URLSearchParams({
    country: 'us',
    category: 'general',
    pageSize: '50',
    apiKey: process.env.NEWS_API_KEY!,
  })

  const res = await fetch(`${NEWS_API_URL}?${params}`)
  if (!res.ok) {
    throw new Error('Failed to fetch from News API')
  }

  const data = await res.json()

  if (!Array.isArray(data.articles)) {
    throw new Error('Invalid news response')
  }

  const articles = data.articles.map((a: any) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    image_url: a.urlToImage,
    source: a.source?.name ?? null,
    category: 'general',
    country: 'us',
    published_at: a.publishedAt
      ? new Date(a.publishedAt).toISOString()
      : new Date().toISOString(),
  }))

  const { error } = await supabaseAdmin
    .from('news')
    .upsert(articles, { onConflict: 'url' })

  if (error) {
    throw error
  }

  return { inserted: articles.length }
}
