-- loginテーブルの現在の状況を確認
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'login'
ORDER BY ordinal_position;

-- loginテーブルの内容を確認
SELECT * FROM public.login;

-- mailカラムが存在しない場合は追加
ALTER TABLE public.login 
ADD COLUMN IF NOT EXISTS mail TEXT;

-- armdxユーザーのメールアドレスを設定（実際のメールアドレスに変更してください）
UPDATE public.login 
SET mail = 'admin@example.com' 
WHERE id = 'armdx';

-- 設定後の確認
SELECT id, mail FROM public.login WHERE id = 'armdx'; 