-- ============================================================================
-- PodHub Database Initialization Script
-- Run this entire script in Supabase SQL Editor to set up all tables
-- ============================================================================

-- 1. Create profiles table for user public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- RLS Policies: Public read, owner write
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
  FOR DELETE USING (auth.uid() = id);

-- ============================================================================
-- 2. Create trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1) || '-' || SUBSTR(new.id::TEXT, 1, 8)),
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that runs on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. Create podcasts table
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "podcasts_select_published" ON public.podcasts;
DROP POLICY IF EXISTS "podcasts_insert_own" ON public.podcasts;
DROP POLICY IF EXISTS "podcasts_update_own" ON public.podcasts;
DROP POLICY IF EXISTS "podcasts_delete_own" ON public.podcasts;

-- RLS Policies: Public read for published, owner full access
CREATE POLICY "podcasts_select_published" ON public.podcasts 
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "podcasts_insert_own" ON public.podcasts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "podcasts_update_own" ON public.podcasts 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "podcasts_delete_own" ON public.podcasts 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 4. Create episodes table
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "episodes_select_published" ON public.episodes;
DROP POLICY IF EXISTS "episodes_insert_own" ON public.episodes;
DROP POLICY IF EXISTS "episodes_update_own" ON public.episodes;
DROP POLICY IF EXISTS "episodes_delete_own" ON public.episodes;

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

-- ============================================================================
-- 5. Create follows table for user following system
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "follows_select_all" ON public.follows;
DROP POLICY IF EXISTS "follows_insert_own" ON public.follows;
DROP POLICY IF EXISTS "follows_delete_own" ON public.follows;

CREATE POLICY "follows_select_all" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================================
-- 6. Create podcast_subscriptions table
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "subscriptions_select_all" ON public.podcast_subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_own" ON public.podcast_subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete_own" ON public.podcast_subscriptions;

-- RLS Policies: Public read for counts, authenticated users can manage subscriptions
CREATE POLICY "subscriptions_select_all" ON public.podcast_subscriptions 
  FOR SELECT USING (true);

CREATE POLICY "subscriptions_insert_own" ON public.podcast_subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_delete_own" ON public.podcast_subscriptions 
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 7. Create listens table for analytics
CREATE TABLE IF NOT EXISTS public.listens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  listened_at TIMESTAMPTZ DEFAULT NOW(),
  duration_listened INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_listens_episode_id ON public.listens(episode_id);
CREATE INDEX IF NOT EXISTS idx_listens_user_id ON public.listens(user_id);
CREATE INDEX IF NOT EXISTS idx_listens_listened_at ON public.listens(listened_at DESC);

ALTER TABLE public.listens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listens_select_own_episodes" ON public.listens;
DROP POLICY IF EXISTS "listens_insert_authenticated" ON public.listens;

CREATE POLICY "listens_select_own_episodes" ON public.listens FOR SELECT USING (EXISTS (SELECT 1 FROM public.episodes e JOIN public.podcasts p ON e.podcast_id = p.id WHERE e.id = listens.episode_id AND p.user_id = auth.uid()) OR user_id = auth.uid());
CREATE POLICY "listens_insert_authenticated" ON public.listens FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- Database initialization complete!
-- ============================================================================
