import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error('Supabase URL not configured! Check your environment variables.');
}

if (!process.env.EXPO_PUBLIC_SUPABASE_KEY) {
  throw new Error('Supabase Key not configured! Check your environment variables.');
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);