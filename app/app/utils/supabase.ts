import { createClient } from '@supabase/supabase-js'

const supabaseUrl =  "https://tyouqqjvgrzyszvyouhi.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3VxcWp2Z3J6eXN6dnlvdWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjE5MzksImV4cCI6MjA5MjUzNzkzOX0.bXqbrI9FtP360_QV3CyTMgWFbCrgRACJYr38mKp1hg8"

export const supabase = createClient(supabaseUrl, supabaseKey)