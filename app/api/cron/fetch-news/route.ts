// app/api/cron/fetch-news/route.ts

import { fetchNews } from '@/lib/fetchNews'
import { getSupabaseClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const articles = await fetchNews({
      category: 'general',
      country: 'us',
      pageSize: 5,
    })

    if (!articles.length) {
      return Response.json({ success: true, inserted: 0 })
    }

    const formatted = articles.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image_url: a.urlToImage ?? null,
      source: a.source.name,
      published_at: a.publishedAt,
      category: 'general',
      country: 'us',
    }))

    const { error } = await supabase
      .from('news')
      .insert(formatted)

    if (error) throw error

    return Response.json({ success: true, inserted: formatted.length })
  } catch (err) {
    console.error(err)
    return new Response('Cron failed', { status: 500 })
  }
}
