import { supabase } from './supabaseClient';

export async function getArticles(category?: string, country?: string) {
  let query = supabase.from('news').select('*');
  if (category) query = query.eq('category', category);
  if (country) query = query.eq('country', country);
  const { data, error } = await query.order('publishedAt', { ascending: false });
  return { data, error };
}
