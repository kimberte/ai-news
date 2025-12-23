'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './NewsList.module.css'

export interface Article {
  id: number
  title: string
  description: string | null
  content: string | null
  source: string
  url: string
  published_at: string
  category: string
  country: string
}

interface Props {
  category: string
  country: string
}

export default function NewsList({ category, country }: Props) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .eq('country', country)
        .order('published_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error(error)
        setError('Failed to load news')
        setArticles([])
      } else {
        setArticles((data as Article[]) || [])
      }

      setLoading(false)
    }

    fetchArticles()
  }, [category, country])

  if (loading) {
    return <p>Loading news…</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (articles.length === 0) {
    return <p>No articles found.</p>
  }

  return (
    <div className={styles.list}>
      {articles.map(article => (
        <article key={article.id} className={styles.card}>
          <h2>{article.title}</h2>

          {article.description && (
            <p className={styles.description}>{article.description}</p>
          )}

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Read full article →
          </a>
        </article>
      ))}
    </div>
  )
}
