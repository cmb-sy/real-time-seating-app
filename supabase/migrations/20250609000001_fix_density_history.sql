-- 既存のdensity_historyテーブルを確認し、存在しない場合は作成

-- 最初にテーブルが存在するか確認
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'density_history'
    ) THEN
        -- テーブルが存在しない場合は作成
        CREATE TABLE public.density_history (
            id SERIAL PRIMARY KEY,
            day_of_week INTEGER NOT NULL, -- 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
            occupied_seats INTEGER NOT NULL,
            density_rate DECIMAL(5,2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT valid_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
            CONSTRAINT valid_density_rate CHECK (density_rate >= 0 AND density_rate <= 100)
        );

        -- インデックスを作成
        CREATE INDEX idx_density_history_created_at ON public.density_history(created_at);
        
        -- RLSポリシーを設定
        ALTER TABLE public.density_history ENABLE ROW LEVEL SECURITY;
        
        -- 全てのユーザーがアクセスできるポリシーを作成
        CREATE POLICY "Allow all users to read density_history"
            ON public.density_history
            FOR SELECT USING (true);
        
        -- 認証されたユーザーがデータを追加できるポリシーを作成
        CREATE POLICY "Allow authenticated users to insert density_history"
            ON public.density_history
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
        
        RAISE NOTICE 'density_history テーブルが作成されました';
    ELSE
        RAISE NOTICE 'density_history テーブルは既に存在します';
    END IF;
    
    -- トリガー関数が存在しない場合は作成
    IF NOT EXISTS (
        SELECT FROM pg_proc
        WHERE proname = 'cleanup_old_density_records'
    ) THEN
        -- 古いレコードを削除する関数を作成
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
        
        -- トリガーを作成
        DROP TRIGGER IF EXISTS trigger_cleanup_old_density_records ON public.density_history;
        CREATE TRIGGER trigger_cleanup_old_density_records
            AFTER INSERT ON public.density_history
            EXECUTE FUNCTION cleanup_old_density_records();
            
        RAISE NOTICE 'cleanup_old_density_records トリガーが作成されました';
    ELSE
        RAISE NOTICE 'cleanup_old_density_records トリガーは既に存在します';
    END IF;
END $$;
