import { fetchNews } from '@/lib/fetchNews';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await fetchNews();

    return Response.json({
      success: true,
      message: 'News fetched successfully'
    });
  } catch (error: any) {
    console.error('Cron fetch failed:', error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
