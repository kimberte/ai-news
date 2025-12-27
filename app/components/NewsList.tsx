'use client'

import { useEffect, useState } from 'react'
import styles from './NewsList.module.css'

type Article = {
  id: number
  title: string
  description: string
  url: string
  source: string
  published_at: string
}

export default function NewsList({
  category,
  country,
}: {
  category: string
  country: string
}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const res = await fetch(
        `/api/news?category=${category}&country=${country}`
      )
      const data = await res.json()

      setArticles(data ?? [])
      setLoading(false)
    }

    load()
  }, [category, country])

  if (loading) return <p>Loading news…</p>

  return (
    <div className={styles.list}>
      {articles.map((a) => (
        <article key={a.id} className={styles.card}>
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <a href={a.url} target="_blank" rel="noreferrer">
            Read more →
          </a>
        </article>
      ))}
    </div>
  )
}
