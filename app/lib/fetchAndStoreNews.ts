import { supabase } from './supabaseClient'

const NEWS_API_KEY = process.env.NEWS_API_KEY!
const BASE_URL = 'https://newsapi.org/v2/top-headlines'

export async function fetchAndStoreNews() {
  const url = `${BASE_URL}?country=us&pageSize=50&apiKey=${NEWS_API_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch news')

  const data = await res.json()
  const articles = data.articles || []

  for (const article of articles) {
    await supabase.from('news').upsert(
      {
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source?.name,
        image_url: article.urlToImage,
        published_at: article.publishedAt
      },
      { onConflict: 'url' }
    )
  }

  return { inserted: articles.length }
}
