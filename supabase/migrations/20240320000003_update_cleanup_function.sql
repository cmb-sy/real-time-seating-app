-- 古いレコード削除関数を200件上限に更新
CREATE OR REPLACE FUNCTION cleanup_old_density_records()
RETURNS TRIGGER AS $$
BEGIN
    -- 200件を超える古いレコードを削除
    DELETE FROM public.density_history
    WHERE id IN (
        SELECT id
        FROM public.density_history
        ORDER BY created_at ASC
        OFFSET 200
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 既存のトリガーはそのまま使用（関数だけ更新） 