import { createClient } from '@supabase/supabase-js'

const supabaseUrl:any =  import.meta.env.SVELTE_SVELTE_APP_SUPABASE_URL;
const supabaseAnonKey:any = import.meta.env.SVELTE_SVELTE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)