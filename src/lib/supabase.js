import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing! Check your .env file or hosting environment variables.')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: async () => { }
        },
        from: () => ({
            select: () => ({ order: () => ({}), eq: () => ({ single: () => ({ data: null, error: null }) }) }),
            insert: () => ({}),
            update: () => ({ eq: () => ({}) }),
            delete: () => ({ eq: () => ({}) })
        })
    }
