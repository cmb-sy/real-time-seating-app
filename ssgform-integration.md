# SSGform 統合ガイド

## 概要

座席管理システムのお問い合わせフォームは、[SSGform](https://ssgform.com/)を使用して実装されています。
これにより、複雑なメールサーバー設定や API エンドポイントの管理が不要になりました。

## SSGform 設定

### フォーム URL

```
https://ssgform.com/s/9TBp9oe5J3wt
```

### 送信されるフィールド

| フィールド名 | 種類     | 説明                             |
| ------------ | -------- | -------------------------------- |
| `name`       | text     | ユーザーの名前（必須）           |
| `message`    | textarea | 要望内容（必須）                 |
| `form_type`  | hidden   | "座席管理システム要望"（識別用） |
| `timestamp`  | hidden   | 送信日時（ISO 形式）             |

## 実装詳細

### フロントエンド（React）

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(e.currentTarget);

  try {
    const response = await fetch("https://ssgform.com/s/9TBp9oe5J3wt", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } else {
      throw new Error("送信に失敗しました");
    }
  } catch (error) {
    console.error("送信エラー:", error);
    alert("送信に失敗しました。しばらく経ってから再度お試しください。");
  } finally {
    setIsSubmitting(false);
  }
};
```

### HTML フォーム

```html
<form onSubmit="{handleSubmit}">
  <input type="text" name="name" required />
  <textarea name="message" required></textarea>

  <!-- 識別用の隠しフィールド -->
  <input type="hidden" name="form_type" value="座席管理システム要望" />
  <input type="hidden" name="timestamp" value="2024-01-20T12:00:00.000Z" />

  <button type="submit">送信</button>
</form>
```

## メリット

### 1. **簡単な実装**

- 複雑なメールサーバー設定が不要
- 環境変数の管理が不要
- エラーハンドリングがシンプル

### 2. **高い信頼性**

- SSGform のインフラを使用
- スパムフィルター対策済み
- 高い配信率

### 3. **管理の容易さ**

- SSGform ダッシュボードで送信履歴を確認
- 自動返信の設定可能
- 複数の通知先設定可能

### 4. **セキュリティ**

- CSRF 対策
- スパム対策
- 適切な CORS ヘッダー

## SSGform 管理画面での設定

### 基本設定

1. **通知先メールアドレス**: 要望を受け取りたいメールアドレス
2. **自動返信**: 送信者への確認メール（オプション）
3. **リダイレクト設定**: 送信後の遷移先（オプション）

### 推奨設定

```
通知先: admin@example.com
件名: 【座席管理システム】新しい要望
自動返信: 有効
リダイレクト: なし（JavaScript処理）
```

## 移行による変更点

### 削除・無効化されたもの

- `/api/send-feedback` エンドポイント（無効化済み）
- 複雑なメール送信ロジック
- 環境変数（SMTP_USER, SMTP_APP_PASSWORD 等）
- Supabase の login テーブル参照

### 新しく追加されたもの

- SSGform への直接投稿
- シンプルなフォームハンドリング
- 隠しフィールドによる識別

## トラブルシューティング

### よくある問題

1. **送信が失敗する**

   - ネットワーク接続を確認
   - SSGform のサービス状況を確認

2. **メールが届かない**

   - SSGform 管理画面で送信履歴を確認
   - 通知先メールアドレスの設定を確認
   - スパムフォルダを確認

3. **フォームが動作しない**
   - ブラウザのコンソールでエラーを確認
   - CORS エラーの場合は SSGform のドメイン設定を確認

### デバッグ方法

```javascript
// ブラウザコンソールでフォームデータを確認
const form = document.querySelector("form");
const formData = new FormData(form);
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
```

## 今後の拡張

### 可能な改善

1. **フィールドの追加**: カテゴリ、優先度等
2. **ファイルアップロード**: スクリーンショット添付
3. **多言語対応**: 英語フォームの追加
4. **統計機能**: 要望の分析とレポート

これらの機能は、SSGform の機能範囲内で実装可能です。
