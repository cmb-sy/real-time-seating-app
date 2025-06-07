-- 密度履歴テーブルの作成
CREATE TABLE IF NOT EXISTS public.density_history (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL, -- 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
    occupied_seats INTEGER NOT NULL,
    density_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
    CONSTRAINT valid_density_rate CHECK (density_rate >= 0 AND density_rate <= 100)
);

-- インデックスの作成（created_atでソートするため）
CREATE INDEX IF NOT EXISTS idx_density_history_created_at ON public.density_history(created_at);

-- 古いレコードを削除する関数
CREATE OR REPLACE FUNCTION cleanup_old_density_records()
RETURNS TRIGGER AS $$
BEGIN
    -- 150件を超える古いレコードを削除
    DELETE FROM public.density_history
    WHERE id IN (
        SELECT id
        FROM public.density_history
        ORDER BY created_at ASC
        OFFSET 150
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
DROP TRIGGER IF EXISTS trigger_cleanup_old_density_records ON public.density_history;
CREATE TRIGGER trigger_cleanup_old_density_records
    AFTER INSERT ON public.density_history
    EXECUTE FUNCTION cleanup_old_density_records(); 