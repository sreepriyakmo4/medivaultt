import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://mpqtcxkvqiaipeppvoti.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcXRjeGt2cWlhaXBlcHB2b3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQwODEsImV4cCI6MjA3NjMxMDA4MX0.ZZCuAbW8GYHlDowV2uaXM_Yu5qxqDTYI-W6lQRnYwGc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)