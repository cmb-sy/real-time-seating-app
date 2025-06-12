import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabase設定を取得（フォールバックあり）
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://howmdafbaqrbyzbcpazk.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd21kYWZiYXFyYnl6YmNwYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDA5NDYsImV4cCI6MjA2NDMxNjk0Nn0.6IFpij4HaWv4TxXF1-rFcbAL1fqDnJJZ4p5sNbCrzWY";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  supabaseAnonKey;

// 管理者用Supabaseクライアント（サービスロールキー使用でRLSをバイパス）
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    storageKey: "supabase-admin-auth", // 管理者用の異なるストレージキー
  },
});

// 一般ユーザー用Supabaseクライアント（匿名キー使用）
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: "supabase-user-auth",
  },
});

export { supabase, supabaseAdmin };
