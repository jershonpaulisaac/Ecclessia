import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Check your .env file or hosting environment variables.')
}

const missingConfig = () => {
    const msg = "Supabase configuration missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Settings (Environment Variables).";
    alert(msg);
    return { data: null, error: { message: msg } };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: async () => { },
            signUp: async () => missingConfig(),
            signInWithPassword: async () => missingConfig(),
        },
        from: () => ({
            select: () => ({ order: () => ({}), eq: () => ({ single: () => ({ data: null, error: null }) }) }),
            insert: () => missingConfig(),
            update: () => ({ eq: () => ({}) }),
            delete: () => ({ eq: () => ({}) })
        })
    }
