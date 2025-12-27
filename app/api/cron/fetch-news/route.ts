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
      return Response.json({ message: 'No articles found' })
    }

    const { error } = await supabase.from('news').insert(
      articles.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image_url: a.imageUrl,
        published_at: a.publishedAt,
        source: a.source,
      }))
    )

    if (error) {
      throw error
    }

    return Response.json({ success: true, count: articles.length })
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    )
  }
}
