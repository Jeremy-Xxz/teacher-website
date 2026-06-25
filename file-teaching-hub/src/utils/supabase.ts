import { createClient } from '@supabase/supabase-js';

// 💡 讓他完全自動去讀取你的 .env.local 檔案內容
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rpjdzchsbfaaquqeyfyw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwamR6Y2hzYmZhYXF1cWV5Znl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzk0NTUsImV4cCI6MjA5Nzk1NTQ1NX0.qBILoGMRnvfmzpgbfOaIENGw_C5ocDeZ6f9bSsI2zrc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);