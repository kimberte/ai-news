import { NextResponse } from 'next/server'
import { fetchNews } from '@/app/lib/newsProviders'
import { getSupabaseClient } from '@/app/lib/supabaseClient'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const articles = await fetchNews({
      category: 'general',
      country: 'us',
      pageSize: 5,
    })

    for (const article of articles) {
      const { error } = await supabase
        .from('news')
        .upsert(
          {
            title: article.title,
            description: article.description,
            content: article.content,
            source: article.source,
            url: article.url,
            published_at: article.publishedAt,
            category: article.category,
            country: article.country,
          },
          { onConflict: 'url' }
        )

      if (error) {
        console.error('❌ Supabase insert error:', error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Cron error:', err)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
