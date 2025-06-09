-- loginテーブルにmailカラムを追加

-- mailカラムを追加
ALTER TABLE public.login 
ADD COLUMN IF NOT EXISTS mail TEXT;

-- デフォルトのメールアドレスを設定（必要に応じて変更してください）
UPDATE public.login 
SET mail = 'admin@example.com' 
WHERE id = 'armdx' AND mail IS NULL; 