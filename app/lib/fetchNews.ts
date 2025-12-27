import { supabase } from './supabaseClient';

export async function fetchNews() {
  try {
    // Example: fetch from news API
    const res = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=' + process.env.NEWS_API_KEY);
    const data = await res.json();

    if (!data.articles) throw new Error('No articles returned');

    for (const article of data.articles) {
      await supabase
        .from('news')
        .upsert({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          published_at: article.publishedAt,
          source: article.source.name
        });
    }

    console.log(`Fetched and stored ${data.articles.length} articles.`);
  } catch (error) {
    console.error('fetchNews error:', error);
    throw error;
  }
}
