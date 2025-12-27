'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
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

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)

      const supabase = getSupabaseClient()

      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .eq('country', country)
        .order('published_at', { ascending: false })
        .limit(20)

      setArticles((data as Article[]) || [])
      setLoading(false)
    }

    fetchArticles()
  }, [category, country])

  if (loading) return <p>Loading news…</p>

  return (
    <div className={styles.list}>
      {articles.map(article => (
        <article key={article.id} className={styles.card}>
          <h2>{article.title}</h2>
          {article.description && <p>{article.description}</p>}
          <a href={article.url} target="_blank">Read more →</a>
        </article>
      ))}
    </div>
  )
}
