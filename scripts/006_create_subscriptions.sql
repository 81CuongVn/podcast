-- Create podcast_subscriptions table
CREATE TABLE IF NOT EXISTS public.podcast_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  podcast_id UUID NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, podcast_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.podcast_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_podcast_id ON public.podcast_subscriptions(podcast_id);

-- Enable RLS
ALTER TABLE public.podcast_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for counts, authenticated users can manage subscriptions
CREATE POLICY "subscriptions_select_all" ON public.podcast_subscriptions 
  FOR SELECT USING (true);

CREATE POLICY "subscriptions_insert_own" ON public.podcast_subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_delete_own" ON public.podcast_subscriptions 
  FOR DELETE USING (auth.uid() = user_id);
