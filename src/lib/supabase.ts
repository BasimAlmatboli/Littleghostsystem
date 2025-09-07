import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://hqtznxyselgjnghprjqs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdHpueHlzZWxnam5naHByanFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTk0MDIsImV4cCI6MjA0OTg3NTQwMn0.kzPPScbVaAOzvGycNt81Xcn6kLkeLExEXKb-yF683s8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);