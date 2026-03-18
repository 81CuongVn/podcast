-- Create podcasts table
CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  category TEXT,
  language TEXT DEFAULT 'en',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_podcasts_user_id ON public.podcasts(user_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_category ON public.podcasts(category);
CREATE INDEX IF NOT EXISTS idx_podcasts_is_published ON public.podcasts(is_published);

-- Enable RLS
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for published, owner full access
CREATE POLICY "podcasts_select_published" ON public.podcasts 
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "podcasts_insert_own" ON public.podcasts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "podcasts_update_own" ON public.podcasts 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "podcasts_delete_own" ON public.podcasts 
  FOR DELETE USING (auth.uid() = user_id);
