export async function fetchNews(category = 'general', country = 'us', pageSize = 5) {
  try {
    // Debug log
    console.log('🔑 NEWS_API_KEY present:', !!process.env.NEWS_API_KEY);

    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`
    );

    const data = await res.json();

    console.log('Raw response from NewsAPI:', data);

    if (!data.articles || !Array.isArray(data.articles)) {
      return [];
    }

    return data.articles.map((article: any) => ({
      title: article.title ?? 'No title',
      description: article.description ?? '',
      content: article.content ?? '',
      source: article.source?.name ?? 'Unknown',
      url: article.url ?? '',
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      category,
      country
    }));
  } catch (err) {
    console.error('Error fetching news:', err);
    return [];
  }
}
