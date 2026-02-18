import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Singleton: prevent HMR / Strict Mode from creating multiple GoTrueClients
// (multiple clients fight over navigatorLock, causing AbortError)
function getOrCreateClient(): SupabaseClient {
  const w = window as any;
  if (w.__supabase) {
    console.log('[supabase] Reusing existing client');
    return w.__supabase;
  }
  console.log('[supabase] Creating NEW client');
  w.__supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  return w.__supabase;
}

export const supabase: SupabaseClient = getOrCreateClient();

// Helper types
export type User = {
  id: string;
  email: string;
  role: 'creator' | 'buyer' | 'admin';
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
};

export type AuthResponse = {
  user: User | null;
  session: any;
  error: any;
};
