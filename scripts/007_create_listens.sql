-- Create listens table for analytics
CREATE TABLE IF NOT EXISTS public.listens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  listened_at TIMESTAMPTZ DEFAULT NOW(),
  duration_listened INTEGER DEFAULT 0, -- seconds listened
  completed BOOLEAN DEFAULT false
);

-- Create indexes for faster analytics queries
CREATE INDEX IF NOT EXISTS idx_listens_episode_id ON public.listens(episode_id);
CREATE INDEX IF NOT EXISTS idx_listens_user_id ON public.listens(user_id);
CREATE INDEX IF NOT EXISTS idx_listens_listened_at ON public.listens(listened_at DESC);

-- Enable RLS
ALTER TABLE public.listens ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Podcast owners can read listens for their episodes, users can insert
CREATE POLICY "listens_select_own_episodes" ON public.listens 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.episodes e
      JOIN public.podcasts p ON e.podcast_id = p.id
      WHERE e.id = listens.episode_id 
      AND p.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "listens_insert_authenticated" ON public.listens 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
