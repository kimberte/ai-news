// app/api/cron/fetch-news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import fetch from 'node-fetch';

export const runtime = 'nodejs';

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function GET(req: NextRequest) {
  try {
    if (!NEWS_API_KEY) throw new Error('NEWS_API_KEY is not set');

    // Fetch top headlines
    const res = await fetch(`${NEWS_API_URL}?country=us&apiKey=${NEWS_API_KEY}`);
    if (!res.ok) throw new Error(`News API responded with status ${res.status}`);

    const data = await res.json();
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('No articles returned from News API');
    }

    // Transform to match your Supabase table
    const articles = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      url_to_image: article.urlToImage,
      published_at: article.publishedAt,
      source_name: article.source?.name,
      category: 'general', // you can dynamically map categories later
      country: 'us',
    }));

    // Upsert to avoid duplicates
    const { error } = await supabase
      .from('news')
      .upsert(articles, { onConflict: ['title', 'published_at'] });

    if (error) throw error;

    return NextResponse.json({ success: true, inserted: articles.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch news' }, { status: 500 });
  }
}
