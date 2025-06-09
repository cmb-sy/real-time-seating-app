-- 密度履歴テーブルのCHECK制約を修正
-- 既存の制約を削除して新しい制約を追加

-- 古い制約を削除
ALTER TABLE public.density_history DROP CONSTRAINT IF EXISTS valid_day_of_week;
ALTER TABLE public.density_history DROP CONSTRAINT IF EXISTS valid_density_rate;

-- 新しい制約を追加
ALTER TABLE public.density_history 
ADD CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6);

ALTER TABLE public.density_history 
ADD CONSTRAINT valid_density_rate CHECK (density_rate >= 0 AND density_rate <= 100);

-- 占有席数の制約を追加（0以上、8以下とする）
ALTER TABLE public.density_history 
ADD CONSTRAINT valid_occupied_seats CHECK (occupied_seats >= 0 AND occupied_seats <= 8); 