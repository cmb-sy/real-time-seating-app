import { createClient } from "@supabase/supabase-js";

// Supabase設定
const supabaseUrl = "https://howmdafbaqrbyzbcpazk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd21kYWZiYXFyYnl6YmNwYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDA5NDYsImV4cCI6MjA2NDMxNjk0Nn0.6IFpij4HaWv4TxXF1-rFcbAL1fqDnJJZ4p5sNbCrzWY";
const supabaseServiceRoleKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Supabaseクライアントの初期化 - 開発環境ではRLSをバイパス
const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

export { supabase };
