// lib/fetchNews.ts

export type FetchNewsParams = {
  category: string
  country: string
  pageSize: number
}

export type NewsArticle = {
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedAt: string
  source: string
}

export async function fetchNews({
  category,
  country,
  pageSize,
}: FetchNewsParams): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    throw new Error('NEWS_API_KEY is not set')
  }

  const url =
    `https://newsapi.org/v2/top-headlines` +
    `?category=${category}` +
    `&country=${country}` +
    `&pageSize=${pageSize}` +
    `&apiKey=${apiKey}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch news')
  }

  const json = await res.json()

  return (json.articles || []).map((a: any) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    imageUrl: a.urlToImage,
    publishedAt: a.publishedAt,
    source: a.source?.name ?? 'Unknown',
  }))
}
