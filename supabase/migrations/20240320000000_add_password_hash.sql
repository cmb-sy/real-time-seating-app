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

-- 既存のパスワードをハッシュ化
UPDATE login
SET pass = crypt(pass, gen_salt('bf'))
WHERE pass IS NOT NULL;

-- トリガーを作成
DROP TRIGGER IF EXISTS hash_password_trigger ON login;
CREATE TRIGGER hash_password_trigger
  BEFORE INSERT OR UPDATE ON login
  FOR EACH ROW
  EXECUTE FUNCTION hash_password(); 