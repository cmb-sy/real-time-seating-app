import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabase設定を取得（フォールバックあり）
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://placeholder.supabase.co"; // プレースホルダー

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  "placeholder-anon-key"; // プレースホルダー

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  "placeholder-service-role-key"; // プレースホルダー

// 環境変数チェック
const isConfigured =
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-anon-key";

if (!isConfigured) {
  console.warn(
    "⚠️ Supabase環境変数が設定されていません。機能が制限される可能性があります。"
  );
}

// 管理者用Supabaseクライアント（サービスロールキー使用）
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

export { supabase, supabaseAdmin, isConfigured };
