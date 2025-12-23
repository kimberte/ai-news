import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/newsProviders';

export const runtime = 'nodejs';

type Article = {
  title: string;
  url: string;
  source?: {
    name?: string;
  };
};

export async function GET() {
  try {
    console.log('✅ Cron job ran at:', new Date().toISOString());

    const articles: Article[] = await fetchNews();

    console.log('🧪 fetchNews returned:', articles);

    console.log('📰 Articles fetched count:', articles.length);

    if (articles.length > 0) {
      console.log('📰 First article title:', articles[0].title);
    }

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
