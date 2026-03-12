/**
 * supabase_client.js
 *
 * Creates and exports a singleton Supabase client instance.
 * The client is configured via environment variables so that
 * credentials are never hard-coded in source files.
 *
 * Required env vars (set in .env):
 *   VITE_SUPABASE_URL      — your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY — your Supabase project's public anon key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[supabase_client] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
        'Add these to your .env file.'
    );
}

/**
 * Singleton Supabase client.
 * Import this wherever you need to interact with Supabase.
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
