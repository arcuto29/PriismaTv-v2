import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yjprgkslvychvyjchulw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcHJna3NsdnljaHZ5amNodWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NzgxMzgsImV4cCI6MjA5ODI1NDEzOH0._ffgYdUoX51WODce2P1RLSi8K-i0IYUGJ0npwONi1VE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
