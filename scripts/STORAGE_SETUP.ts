/**
 * Storage Setup Instructions for Supabase
 * 
 * Run these steps in your Supabase dashboard to enable podcast media uploads:
 */

// 1. Create a storage bucket named 'podcast-media' in Supabase
// - Go to Supabase Dashboard > Storage
// - Click "New bucket"
// - Name: "podcast-media"
// - Check "Public bucket" (to allow streaming)
// - Create

// 2. Set up CORS policy (Policies tab in Storage)
// Add the following policy to allow uploads from your domain:
const corsPolicy = {
  name: 'Allow localhost uploads',
  definition: {
    allowed_headers: ['*'],
    allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    allowed_origins: ['localhost:3000', 'http://localhost:3000', 'https://<your-domain>'],
    max_age: 3600,
  },
}

// 3. Create RLS policies for public read, authenticated write:

// Policy: Allow public read
// ```sql
// CREATE POLICY "Allow public read"
// ON storage.objects for SELECT
// USING ( bucket_id = 'podcast-media' );
// ```

// Policy: Allow authenticated users to upload
// ```sql
// CREATE POLICY "Allow authenticated upload"
// ON storage.objects for INSERT
// WITH CHECK (
//   bucket_id = 'podcast-media' 
//   AND auth.role() = 'authenticated'
// );
// ```

// SQL to run in Supabase SQL Editor:
export const setupSQL = `
-- Create podcast-media bucket
insert into storage.buckets (id, name, public)
values ('podcast-media', 'podcast-media', true)
ON CONFLICT DO NOTHING;

-- Allow public read
drop policy if exists "Allow public read" on storage.objects;
create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'podcast-media' );

-- Allow authenticated upload
drop policy if exists "Allow authenticated upload" on storage.objects;
create policy "Allow authenticated upload"
on storage.objects for insert
with check (
  bucket_id = 'podcast-media' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated delete
drop policy if exists "Allow authenticated delete" on storage.objects;
create policy "Allow authenticated delete"
on storage.objects for delete
using (
  bucket_id = 'podcast-media' 
  and auth.role() = 'authenticated'
);
`;
