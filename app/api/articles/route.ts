// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.url ? new URL(req.url) : {};
    const category = searchParams?.get('category') || 'general';
    const country = searchParams?.get('country') || 'us';
    const page = Number(searchParams?.get('page')) || 1;
    const limit = Number(searchParams?.get('limit')) || 20;

    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .eq('country', country)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    return NextResponse.json({ articles: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unexpected error fetching articles' },
      { status: 500 }
    );
  }
}
