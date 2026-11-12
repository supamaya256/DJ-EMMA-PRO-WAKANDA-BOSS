import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ruyediepdsvycrxniplt.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EaGYMl3jfXzLvuJTGLH7oA_N_3yM9gw';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
