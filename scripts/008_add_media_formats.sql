-- Add media_type column to episodes table to support audio, video, and other formats
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'audio' CHECK (media_type IN ('audio', 'video', 'document', 'transcript'));

-- Add media_size for tracking file sizes
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS media_size INTEGER;

-- Add media_url for direct access (instead of just audio_url)
ALTER TABLE public.episodes 
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Update indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_episodes_media_type ON public.episodes(media_type);

-- Add view for getting episodes by media type
CREATE OR REPLACE VIEW public.episodes_by_type AS
SELECT 
  id,
  podcast_id,
  title,
  description,
  media_type,
  duration,
  is_published,
  created_at,
  audio_url,
  media_url
FROM public.episodes;
