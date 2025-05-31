# リアルタイム座席管理アプリ（Real-time Seating App）

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/cmb-sys-projects/v0-real-time-seating-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ulTG8hrxt09)

## 📋 概要

このアプリケーションは、施設やオフィスなどの座席状況をリアルタイムで管理・可視化するためのシステムです。利用者は座席の予約、空き状況の確認、座席の利用状況の追跡などができます。

## ✨ 主な機能

- **リアルタイム座席表示**: 現在の座席利用状況をリアルタイムで確認
- **座席予約**: 利用者が希望の座席を事前に予約可能
- **IP制限**: 特定のIPアドレスからのみアクセス可能なセキュリティ機能
- **管理者ダッシュボード**: 座席の利用状況や統計を確認

## 🚀 はじめ方

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
