-- Create global site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'PodStream',
  site_description TEXT NOT NULL DEFAULT 'The professional podcast platform for creators and listeners.',
  site_domain TEXT NOT NULL DEFAULT 'podcast.hamhochoi.com',
  public_registration BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_all" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_update_admin" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_insert_admin" ON public.site_settings;

CREATE POLICY "site_settings_select_all"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "site_settings_update_admin"
ON public.site_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);

CREATE POLICY "site_settings_insert_admin"
ON public.site_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
  )
);
