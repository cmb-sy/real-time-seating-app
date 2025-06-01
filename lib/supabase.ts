import { createClient } from "@supabase/supabase-js";

// Supabase設定
// 環境変数が認識されない問題を解決するため一時的にハードコード
const supabaseUrl = "https://howmdafbaqrbyzbcpazk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd21kYWZiYXFyYnl6YmNwYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDA5NDYsImV4cCI6MjA2NDMxNjk0Nn0.6IFpij4HaWv4TxXF1-rFcbAL1fqDnJJZ4p5sNbCrzWY";

// サービスロールキー（Row Level Securityをバイパスするため）
// 注意: 実際のプロダクション環境ではクライアントサイドで公開すべきではありません
// 代わりにAPIfunctionやミドルウェアを使用してください
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd21kYWZiYXFyYnl6YmNwYXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc0MDk0NiwiZXhwIjoyMDY0MzE2OTQ2fQ.45czt-j0AxR679-1Vhz6IERiQxozT8hQqgKVpU3RpBM"; // 実際のキーに置き換えてください

// 本番環境ではログ出力を削除
if (process.env.NODE_ENV !== "production") {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key:", supabaseAnonKey ? "設定済み" : "未設定");
}

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
