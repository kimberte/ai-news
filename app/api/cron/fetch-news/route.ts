import { fetchNews } from '@/lib/fetchNews';
import { runtime } from '@/lib/supabase';

export const runtime = 'nodejs';

export default async function handler(req: Request) {
  try {
    await fetchNews(); // fetchNews should handle storing data in Supabase
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
