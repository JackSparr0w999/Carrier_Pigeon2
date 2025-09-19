
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ruqzgmqcbaqezsepfqdw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1cXpnbXFjYmFxZXpzZXBmcWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTAzMjAsImV4cCI6MjA3Mzg2NjMyMH0.00G3EQwmqNXUzWGUOv_zP9OPIUlJdAye0Nl1XmtgZg4'
export const supabase = createClient(supabaseUrl, supabaseKey)