import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabaseClient'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const country = searchParams.get('country')

  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)

  if (category) query = query.eq('category', category)
  if (country) query = query.eq('country', country)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
