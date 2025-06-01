## outline

It would be a pain if there were no seats available when you wanted to go to work. That's why we developed a system that can get seat information in real time.
This repository is a real-time seat information confirmation service with that function.

### 必要条件

- Node.js (バージョン 16 以上)
- npm または yarn
- supabase アカウント

### インストール手順

1. リポジトリをクローン:

   ```
   git clone https://github.com/yourusername/real-time-seating-app.git
   cd real-time-seating-app
   ```

2. 依存関係をインストール:

   ```
   npm install
   ```

   または

   ```
   yarn install
   ```

3. 開発サーバーを起動:

   ```
   npm run dev
   ```

   または

   ```
   yarn dev
   ```

4. ブラウザで http://localhost:3000 を開いてアプリケーションにアクセス
5. Supabase の設定を行います。Supabase のプロジェクトを作成し、必要なテーブルと認証を設定してください。
6. `.env.local` ファイルを作成し、以下の環境変数を設定します:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
