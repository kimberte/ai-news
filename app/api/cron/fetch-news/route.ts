import { NextResponse } from 'next/server';
import { fetchNews } from '../../../lib/newsProviders';

export async function GET() {
  const start = new Date().toISOString();
  console.log('🚀 Cron started:', start);

  const articles = await fetchNews('general', 'us', 5);

  console.log('📰 Articles fetched count:', articles.length);

  if (articles.length > 0) {
    articles.forEach((article, index) => {
      console.log(`📝 Article ${index + 1}:`, article.title);
    });
  } else {
    console.log('⚠️ No articles returned');
  }

  console.log('✅ Cron finished');

  return NextResponse.json({
    success: true,
    count: articles.length,
  });
}
