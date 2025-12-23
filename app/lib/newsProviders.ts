type Article = {
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  country: string;
};

export async function fetchNews(
  category = 'general',
  country = 'us',
  pageSize = 5
): Promise<Article[]> {
  try {
    console.log('🔹 Fetching news with:', {
      category,
      country,
      pageSize,
      key: process.env.NEWS_API_KEY?.slice(0, 5) + '...', // partial log
    });

    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}`,
      {
        headers: { 'X-Api-Key': process.env.NEWS_API_KEY! },
      }
    );

    const data = await res.json();

    console.log('🔹 Raw response from NewsAPI:', data);

    // Map source object to string for simplicity
    return (data.articles ?? []).map((a: any) => ({
      title: a.title,
      description: a.description ?? '',
      content: a.content ?? '',
      source: a.source?.name ?? 'Unknown',
      url: a.url,
      publishedAt: a.publishedAt,
      category,
      country,
    }));
  } catch (error) {
    console.error('❌ fetchNews failed:', error);
    return [];
  }
}
