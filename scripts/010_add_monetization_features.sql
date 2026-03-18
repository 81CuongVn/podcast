-- Migration: Add preview and monetization features to podcasts and episodes
-- This migration adds fields to support preview versions, paid content, and monetization features

-- Add columns to podcasts table for monetization support
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS is_monetized boolean DEFAULT false;
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS preview_mode text DEFAULT 'free' CHECK (preview_mode IN ('free', 'preview-only', 'paid-only'));
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS price_usd numeric(10, 2) DEFAULT 0;
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS allow_free_preview boolean DEFAULT true;
ALTER TABLE podcasts ADD COLUMN IF NOT EXISTS preview_episode_count integer DEFAULT 3;

-- Add columns to episodes table for content access control
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS preview_duration_seconds integer DEFAULT 0;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS requires_subscription boolean DEFAULT false;

-- Create a subscriptions enhancement table if episodes need individual access control
CREATE TABLE IF NOT EXISTS episode_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  access_type text NOT NULL CHECK (access_type IN ('free', 'preview', 'paid')),
  accessed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_episode_access UNIQUE(user_id, episode_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_episode_access_logs_user_id ON episode_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_episode_access_logs_episode_id ON episode_access_logs(episode_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_monetized ON podcasts(is_monetized) WHERE is_monetized = true;
CREATE INDEX IF NOT EXISTS idx_episodes_premium ON episodes(is_premium) WHERE is_premium = true;

-- Add comments for documentation
COMMENT ON COLUMN podcasts.preview_mode IS 'Controls how podcast content is accessed: free (all episodes free), preview-only (paid versions only), paid-only (all paid)';
COMMENT ON COLUMN podcasts.allow_free_preview IS 'Whether to allow free preview of paid episodes';
COMMENT ON COLUMN podcasts.preview_episode_count IS 'Number of episodes to allow as free preview';
COMMENT ON COLUMN episodes.is_premium IS 'Whether this episode is premium/paid content';
COMMENT ON COLUMN episodes.requires_subscription IS 'Whether this episode requires podcast subscription';
