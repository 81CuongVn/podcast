-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Update RLS to allow admins to see everything (optional but helpful)
-- Note: SELECT policies already allow public read for some tables, 
-- but you might want to add admin-specific bypasses.
