-- Create episodes table
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  podcast_id UUID NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  audio_pathname TEXT NOT NULL,
  duration INTEGER, -- in seconds
  episode_number INTEGER,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_episodes_podcast_id ON public.episodes(podcast_id);
CREATE INDEX IF NOT EXISTS idx_episodes_is_published ON public.episodes(is_published);
CREATE INDEX IF NOT EXISTS idx_episodes_published_at ON public.episodes(published_at DESC);

-- Enable RLS
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for published episodes of published podcasts, owner full access
CREATE POLICY "episodes_select_published" ON public.episodes 
  FOR SELECT USING (
    is_published = true 
    OR EXISTS (
      SELECT 1 FROM public.podcasts 
      WHERE podcasts.id = episodes.podcast_id 
      AND podcasts.user_id = auth.uid()
    )
  );

CREATE POLICY "episodes_insert_own" ON public.episodes 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.podcasts 
      WHERE podcasts.id = episodes.podcast_id 
      AND podcasts.user_id = auth.uid()
    )
  );

CREATE POLICY "episodes_update_own" ON public.episodes 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.podcasts 
      WHERE podcasts.id = episodes.podcast_id 
      AND podcasts.user_id = auth.uid()
    )
  );

CREATE POLICY "episodes_delete_own" ON public.episodes 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.podcasts 
      WHERE podcasts.id = episodes.podcast_id 
      AND podcasts.user_id = auth.uid()
    )
  );
