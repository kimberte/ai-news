'use client'

import { useEffect, useState } from 'react'
import styles from './NewsList.module.css'

export type Article = {
  id: string
  title: string
  description: string | null
  url: string
  image_url: string | null
  source: string | null
  published_at: string
}

type Props = {
  category?: string
  country?: string
}

export default function NewsList({ category, country }: Props) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (country) params.append('country', country)

        const res = await fetch(`/api/articles?${params.toString()}`)

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }

        const json = await res.json()

        // 🔒 HARD GUARANTEE ARRAY
        if (Array.isArray(json)) {
          setArticles(json)
        } else if (Array.isArray(json.data)) {
          setArticles(json.data)
        } else {
          console.warn('Unexpected response shape:', json)
          setArticles([])
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load news')
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [category, country])

  if (loading) {
    return <p className={styles.status}>Loading news…</p>
  }

  if (error) {
    return <p className={styles.status}>{error}</p>
  }

  if (articles.length === 0) {
    return <p className={styles.status}>No articles found.</p>
  }

  return (
    <div className={styles.list}>
      {articles.map(article => (
        <article key={article.id} className={styles.card}>
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className={styles.image}
            />
          )}

          <h2 className={styles.title}>{article.title}</h2>

          {article.description && (
            <p className={styles.description}>{article.description}</p>
          )}

          <div className={styles.meta}>
            <span>{article.source}</span>
            <span>
              {new Date(article.published_at).toLocaleDateString()}
            </span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Read more →
          </a>
        </article>
      ))}
    </div>
  )
}
