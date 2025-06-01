-- Allow anonymous users to read/write to seats table
DROP POLICY IF EXISTS "Allow authenticated users to read seats" ON public.seats;
DROP POLICY IF EXISTS "Allow authenticated users to modify seats" ON public.seats;

CREATE POLICY "Allow all users to read seats"
  ON public.seats FOR SELECT
  TO PUBLIC
  USING (TRUE);

CREATE POLICY "Allow all users to modify seats"
  ON public.seats FOR ALL
  TO PUBLIC
  USING (TRUE);

-- Allow anonymous users to read/write to settings table
DROP POLICY IF EXISTS "Allow authenticated users to read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow authenticated users to modify settings" ON public.settings;

CREATE POLICY "Allow all users to read settings"
  ON public.settings FOR SELECT
  TO PUBLIC
  USING (TRUE);

CREATE POLICY "Allow all users to modify settings"
  ON public.settings FOR ALL
  TO PUBLIC
  USING (TRUE);
