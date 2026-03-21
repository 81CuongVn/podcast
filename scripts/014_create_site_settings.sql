-- Create global site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'PodStream',
  site_description TEXT NOT NULL DEFAULT 'The professional podcast platform for creators and listeners.',
  site_domain TEXT NOT NULL DEFAULT 'podcast.hamhochoi.com',
  twitter_url TEXT NOT NULL DEFAULT 'https://twitter.com/johnweek45',
  instagram_url TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT 'support@podstream.com',
  background_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
  primary_color TEXT NOT NULL DEFAULT '#6366f1',
  glassmorphism BOOLEAN NOT NULL DEFAULT true,
  dark_mode BOOLEAN NOT NULL DEFAULT true,
  mobile_nav BOOLEAN NOT NULL DEFAULT true,
  public_registration BOOLEAN NOT NULL DEFAULT true,
  email_verification BOOLEAN NOT NULL DEFAULT true,
  moderator_dashboard BOOLEAN NOT NULL DEFAULT false,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  google_analytics_id TEXT NOT NULL DEFAULT '',
  facebook_pixel_id TEXT NOT NULL DEFAULT '',
  seo_keywords TEXT NOT NULL DEFAULT 'podcast, audio, creator, streaming, music',
  custom_css TEXT NOT NULL DEFAULT '',
  custom_js TEXT NOT NULL DEFAULT '',
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
