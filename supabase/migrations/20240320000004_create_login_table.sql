-- pgcrypto拡張機能を有効にする（crypt関数を使用するため）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- loginテーブルを作成
CREATE TABLE IF NOT EXISTS public.login (
    id TEXT PRIMARY KEY,
    pass TEXT NOT NULL
);

-- RLSポリシーを設定
ALTER TABLE public.login ENABLE ROW LEVEL SECURITY;

-- サービスロールキーでのアクセスを許可
CREATE POLICY "Allow service role access to login"
  ON public.login FOR ALL
  TO service_role
  USING (TRUE);

-- パスワードハッシュ化のための関数を作成
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  -- パスワードが変更された場合のみハッシュ化
  IF NEW.pass IS NOT NULL AND (OLD.pass IS NULL OR NEW.pass != OLD.pass) THEN
    -- パスワードをハッシュ化（bcrypt形式）
    NEW.pass := crypt(NEW.pass, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
DROP TRIGGER IF EXISTS hash_password_trigger ON public.login;
CREATE TRIGGER hash_password_trigger
  BEFORE INSERT OR UPDATE ON public.login
  FOR EACH ROW
  EXECUTE FUNCTION hash_password();

-- パスワード検証用の関数を作成
CREATE OR REPLACE FUNCTION verify_password(username TEXT, password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    -- ユーザーの保存されたハッシュを取得
    SELECT pass INTO stored_hash 
    FROM public.login 
    WHERE id = username;
    
    -- ユーザーが存在しない場合
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- パスワードを検証
    RETURN (crypt(password, stored_hash) = stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 初期ユーザーを作成（パスワードは自動的にハッシュ化される）
INSERT INTO public.login (id, pass)
VALUES ('armdx', 'armdx')
ON CONFLICT (id) DO NOTHING; 