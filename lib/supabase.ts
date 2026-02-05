import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bafrffioupurdhhwchfy.supabase.co"
const supabaseAnonKey = "sb_publishable_7Gma_1ROqI_qAmUJf6vpRA_UwOqOi_r"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
