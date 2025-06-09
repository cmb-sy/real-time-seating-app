# メール送信機能の設定ガイド

## 必要な環境変数

メール送信機能を有効にするには、以下の環境変数を設定する必要があります。

### Vercel の環境変数設定

1. **Vercel ダッシュボード**にアクセス
2. **プロジェクト設定** → **Environment Variables**
3. 以下の変数を追加:

```
SMTP_USER=your-gmail-address@gmail.com
SMTP_APP_PASSWORD=your-gmail-app-password
```

## Gmail 設定手順

### 1. Gmail でアプリパスワードを生成

1. **Google アカウント設定**にアクセス
2. **セキュリティ** → **2 段階認証プロセス**を有効にする
3. **アプリパスワード**を生成
   - アプリ選択: **メール**
   - デバイス選択: **その他（カスタム名）** → "座席管理システム"
4. 生成された 16 文字のパスワードをコピー

### 2. 環境変数に設定

```
SMTP_USER=your-email@gmail.com
SMTP_APP_PASSWORD=abcd efgh ijkl mnop
```

## メール配信が失敗する場合の対処法

### 1. スパムフィルター対策

- **件名を分かりやすく**: 【座席管理システム】など明確な件名
- **送信者名を設定**: "座席管理システム"として送信
- **HTML メール**: スパムフィルターに引っかかりにくい

### 2. Gmail 以外のプロバイダー

#### SendGrid 使用例:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

#### AWS SES 使用例:

```javascript
const transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 587,
  auth: {
    user: process.env.AWS_SES_ACCESS_KEY,
    pass: process.env.AWS_SES_SECRET_KEY,
  },
});
```

## トラブルシューティング

### よくある問題

1. **認証エラー**: アプリパスワードが正しく設定されているか確認
2. **送信制限**: Gmail の 1 日送信制限（500 通）に注意
3. **スパムフォルダ**: 受信者のスパムフォルダを確認
4. **ドメイン認証**: 独自ドメインの場合は SPF/DKIM レコードを設定

### デバッグ方法

1. **Vercel ログ確認**: Functions → View Function Logs
2. **コンソール出力**: メール送信成功時の messageId を確認
3. **テスト送信**: 自分のメールアドレスでテスト

## 推奨設定（本番環境）

### 高信頼性メール配信のために

1. **専用メールサービス**の使用（SendGrid、AWS SES、Mailgun 等）
2. **独自ドメイン**からの送信
3. **SPF、DKIM、DMARC**レコードの設定
4. **送信レート制限**の実装
5. **バウンス処理**の実装

これらの設定により、メールの配信性が大幅に向上します。
