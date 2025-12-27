// app/lib/getArticles.ts
import { supabase } from './supabaseClient'

export interface Article {
  id: string
  title: string
  description: string
  url: string
  image_url?: string
  source?: string
  category?: string
  country?: string
  published_at?: string
}

export async function getArticles(
  category?: string,
  country?: string
): Promise<Article[]> {
  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  if (country) {
    query = query.eq('country', country)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error)
    return []
  }

  return data ?? []
}
