import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const country = searchParams.get('country')

  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(20)

  if (category) {
    query = query.eq('category', category)
  }

  if (country) {
    query = query.eq('country', country)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data ?? [])
}
