import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/newsProviders';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('✅ Cron job ran at:', new Date().toISOString());

    const articles = await fetchNews();

    console.log('📰 Articles fetched:', articles.length);
    articles.forEach((a, i) =>
      console.log(`${i + 1}. ${a.title}`)
    );

    return NextResponse.json({
      success: true,
      count: articles.length,
    });
  } catch (error) {
    console.error('❌ Cron failed:', error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
