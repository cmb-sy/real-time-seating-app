-- Creates tables for real-time seating app

-- Seats Table
CREATE TABLE IF NOT EXISTS public.seats (
  id SERIAL PRIMARY KEY,
  name TEXT,
  is_occupied BOOLEAN DEFAULT FALSE
);

-- Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB
);

-- Enable Realtime for both tables
ALTER TABLE public.seats REPLICA IDENTITY FULL;
ALTER TABLE public.settings REPLICA IDENTITY FULL;

-- Set RLS policies
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read seats"
  ON public.seats FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated users to modify seats"
  ON public.seats FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated users to read settings"
  ON public.settings FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated users to modify settings"
  ON public.settings FOR ALL
  TO authenticated
  USING (TRUE);

-- Initial data for seats (8 empty seats)
INSERT INTO public.seats (id, name, is_occupied)
SELECT i, NULL, FALSE
FROM generate_series(1, 8) AS i
ON CONFLICT (id) DO NOTHING;

-- Insert initial density setting
INSERT INTO public.settings (key, value)
VALUES ('density', '0')
ON CONFLICT (key) DO NOTHING;
