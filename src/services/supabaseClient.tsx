
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
    try {
        client = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
    }
} else {
    console.warn(
        "Supabase credentials are missing or invalid! " +
        "Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file " +
        "and that the URL starts with 'https://'."
    );
}

export const supabase = client;
