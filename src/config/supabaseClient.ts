import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey=process.env.REACT_APP_SUPABASE_ANON_KEY

const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!)
// const supabase = createClient<>(supabaseUrl!, supabaseAnonKey!)

export default supabase
