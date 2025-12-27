import { supabase } from './supabaseClient';

const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

export async function fetchAndStoreNews() {
  if (!NEWS_API_KEY) {
    throw new Error('Missing NEWS_API_KEY');
  }

  const url = `${BASE_URL}?country=us&pageSize=50&apiKey=${NEWS_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await res.json();

  if (!Array.isArray(data.articles)) {
    throw new Error('Invalid news API response');
  }

  const rows = data.articles.map((a: any) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    image_url: a.urlToImage,
    source: a.source?.name,
    category: 'general',
    country: 'us',
    published_at: a.publishedAt ? new Date(a.publishedAt) : null,
  }));

  const { error } = await supabase
    .from('news')
    .upsert(rows, { onConflict: 'url' });

  if (error) {
    throw error;
  }

  return { inserted: rows.length };
}
