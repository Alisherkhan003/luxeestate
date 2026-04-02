import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Missing Supabase env vars. Copy .env.example → .env and fill values.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export const WA_NUMBER    = import.meta.env.VITE_WA_NUMBER    || '923177908767'
export const ADMIN_EMAIL  = import.meta.env.VITE_ADMIN_EMAIL  || 'admin@luxeestate.pk'
