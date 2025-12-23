'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './NewsList.module.css'

export interface Article {
  title: string
  description: string
  content: string
  source: string
  url: string
  publishedAt: string
  category: string
  country: string
}

interface NewsListProps {
  category: string
  country: string
}

export default function NewsList({ category, country }: NewsListProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      const { data, error } = await supabase
        .from<Article>('news')
        .select('*')
        .eq('category', category)
        .eq('country', country)

      if (error) {
        console.error('Supabase fetch error:', error)
      } else {
        setArticles(data || [])
      }
      setLoading(false)
    }

    fetchNews()
  }, [category, country])

  if (loading) return <p>Loading news...</p>
  if (!articles.length) return <p>No articles found.</p>

  return (
    <div className={styles.newsList}>
      {articles.map((article, index) => (
        <div key={index} className={styles.newsItem}>
          <div className={styles.newsTitle}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </div>
          <div className={styles.newsDescription}>{article.description}</div>
          <div className={styles.newsMeta}>
            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
