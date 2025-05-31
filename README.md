## はじめ方

以下の手順で、ローカル環境でプロジェクトを実行できます。

### 必要条件

- Node.js (バージョン16以上)
- npm または yarn

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

## 🔒 IPアクセス制限の設定

アプリケーションへのアクセスを特定のIPアドレスのみに制限するには、`middleware.ts`ファイルの`allowedIPs`配列にIPアドレスを追加してください。

```typescript
// 許可するIPアドレスのリスト
const allowedIPs = [
  '127.0.0.1',     // localhost
  '::1',           // IPv6 localhost
  '192.168.1.1',   // 追加したいIPアドレス
  // 他のIPアドレスを追加
]
```

## 📦 デプロイ

このプロジェクトはVercelにデプロイされています:

**[https://vercel.com/cmb-sys-projects/v0-real-time-seating-app](https://vercel.com/cmb-sys-projects/v0-real-time-seating-app)**

## 🛠 開発情報

このプロジェクトは以下の技術を使用しています:

- **フロントエンド**: Next.js, React, Tailwind CSS
- **デザインシステム**: shadcn/ui コンポーネント
- **デプロイ**: Vercel
