import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://isyrguafkbjejkzndbav.supabase.co!;
const supabaseKey = process.env.sb_publishable_DkJhx64SJTLswIPg1u1ocA_V6ld7A4k!;

export const supabase = createClient(supabaseUrl, supabaseKey);
