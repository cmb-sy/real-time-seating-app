declare namespace NodeJS {
  interface ProcessEnv {
    // 必須の環境変数
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    // Supabaseサービスロールキー（本番環境用）
    SUPABASE_SERVICE_ROLE_KEY?: string;

    // リセットAPI用の環境変数
    RESET_API_KEY?: string;

    // Basic認証用の環境変数（開発環境・テスト環境用）
    AUTH_USERNAME?: string;
    AUTH_PASSWORD_HASH?: string;
  }
}
