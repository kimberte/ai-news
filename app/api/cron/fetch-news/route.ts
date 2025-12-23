import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/newsProviders';
import { supabase } from '../../../lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('✅ Cron job ran at:', new Date().toISOString());

    const articles = await fetchNews();

    console.log('🧪 Articles fetched:', articles.length);

    for (const article of articles) {
      const { data, error } = await supabase
        .from('news')
        .upsert(
          [
            {
              title: article.title,
              description: article.description,
              content: article.content,
              source: article.source,
              url: article.url,
              publishedAt: article.publishedAt,
              category: article.category,
              country: article.country,
            },
          ],
          { onConflict: 'url' }
        );

      if (error) console.error('❌ Supabase insert error:', error);
      else console.log('✅ Supabase inserted/updated:', article.title);
    }

    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('❌ Cron failed:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
