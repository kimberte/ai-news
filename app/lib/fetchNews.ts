// lib/fetchNews.ts

export interface FetchNewsParams {
  category: string
  country: string
  pageSize?: number
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
}

export async function fetchNews({
  category,
  country,
  pageSize = 10,
}: FetchNewsParams): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    console.warn('NEWS_API_KEY missing')
    return []
  }

  const url =
    `https://newsapi.org/v2/top-headlines` +
    `?category=${category}` +
    `&country=${country}` +
    `&pageSize=${pageSize}` +
    `&apiKey=${apiKey}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    console.error('Failed to fetch news')
    return []
  }

  const json = await res.json()
  return json.articles ?? []
}
