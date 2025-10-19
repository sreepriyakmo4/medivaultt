import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://rtgvrikmkcuusyuvygpy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z3ZyaWtta2N1dXN5dXZ5Z3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjczNDcsImV4cCI6MjA3NjM0MzM0N30.KeSEHDJUn1ifWciXBT1JBPEXI4E45GJ2OHR5FCIDz_U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)