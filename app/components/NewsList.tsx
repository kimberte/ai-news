'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './NewsList.module.css'

export interface Article {
  id: number
  title: string
  description: string
  content: string
  source: string
  url: string
  publishedAt: string
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

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from<Article, 'news'>('news')
        .select('*')
        .eq('category', category)
        .eq('country', country)
        .order('publishedAt', { ascending: false })

      if (error) {
        console.error('Error fetching news:', error)
      } else {
        setArticles(data || [])
      }

      setLoading(false)
    }

    fetchArticles()
  }, [category, country])

  if (loading) return <p className={styles.loading}>Loading news...</p>

  return (
    <div className={styles.list}>
      {articles.map(article => (
        <article key={article.id} className={styles.card}>
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.meta}>
            {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
          </p>
          <p className={styles.description}>{article.description}</p>
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
