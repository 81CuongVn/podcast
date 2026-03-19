-- Create likes table for podcasts and episodes
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  podcast_id uuid references public.podcasts(id) on delete cascade,
  episode_id uuid references public.episodes(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, podcast_id, episode_id),
  -- Ensure at least one is provided but not both (or both if it's a specific episode like)
  constraint like_target check (
    (podcast_id is not null) or (episode_id is not null)
  )
);

-- Enable RLS
alter table public.likes enable row level security;

-- Policies
create policy "Users can view all likes" on public.likes for select using (true);
create policy "Users can manage their own likes" on public.likes for all using (auth.uid() = user_id);

-- Function to get like count
create or replace function get_like_count(p_id uuid default null, e_id uuid default null)
returns bigint as $$
begin
  if e_id is not null then
    return (select count(*) from public.likes where episode_id = e_id);
  else
    return (select count(*) from public.likes where podcast_id = p_id);
  end if;
end;
$$ language plpgsql security definer;
