import { createClient } from "@supabase/supabase-js";

// 環境変数からSupabase設定を取得（フォールバックあり）
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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
