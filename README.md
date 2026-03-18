# PodHub - Podcast Platform

A full-featured podcast creation and discovery platform built with Next.js, Supabase, and Vercel Blob.

## Features

### User Features
- **Authentication**: Email/password sign-up and login with Supabase Auth
- **User Profiles**: Customizable profiles with display name, bio, website, and avatar
- **Podcast Creation**: Create and manage your own podcasts
- **Episode Management**: Upload episodes with audio files to Vercel Blob
- **Podcast Discovery**: Browse all published podcasts and explore by categories
- **Search & Filter**: Find podcasts by title, category, and creator
- **Audio Player**: Built-in player with play/pause, seeking, volume control, and playback speed

### Social Features
- **Follow System**: Follow other creators to see their content
- **Podcast Subscriptions**: Subscribe to podcasts to track them
- **Public Profiles**: View creator profiles and their published podcasts
- **Follower Stats**: Display follower/following counts on profiles

### Analytics
- **Listen Tracking**: Track when episodes are played
- **Completion Rate**: Measure how many listeners complete episodes
- **Dashboard**: View total listens, completed listens, average duration, and top episodes
- **Charts**: Visualize listening trends over time

## Tech Stack

- **Frontend**: Next.js 16 with React Server Components
- **Authentication**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **File Storage**: Vercel Blob (private storage for audio files)
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React

## Project Structure

```
app/
├── (public)/              # Public pages
│   ├── browse/           # Browse all podcasts
│   ├── podcast/[id]/     # Podcast detail page
│   ├── episode/[id]/     # Episode detail page
│   └── profile/[id]/     # Public user profile
├── auth/                 # Auth pages (login, signup, error)
├── dashboard/            # Protected dashboard
│   ├── page.tsx          # Dashboard overview
│   ├── podcasts/         # Podcast management
│   ├── analytics/        # Analytics dashboard
│   ├── subscriptions/    # Subscribed podcasts
│   └── profile/          # Edit profile
├── api/                  # API routes
│   ├── upload/           # Audio and image uploads to Vercel Blob
│   ├── podcasts/         # Podcast CRUD
│   ├── episodes/         # Episode management
│   ├── follows/          # Follow/unfollow
│   ├── subscriptions/    # Subscribe/unsubscribe
│   ├── analytics/listen/ # Track listens
│   └── file/            # Serve private blob files
├── page.tsx             # Homepage
└── layout.tsx           # Root layout

components/
├── podcast/
│   ├── podcast-card.tsx       # Podcast preview card
│   ├── episode-card.tsx       # Episode preview card
│   ├── podcast-grid.tsx       # Grid of podcasts
│   └── podcast-player.tsx     # Audio player
├── layout/
│   ├── header.tsx             # Main navigation
│   ├── footer.tsx             # Site footer
│   └── dashboard-sidebar.tsx  # Dashboard navigation
├── analytics/
│   └── dashboard.tsx          # Analytics dashboard component
└── ui/                        # shadcn/ui components

lib/
├── supabase/
│   ├── client.ts              # Browser Supabase client
│   ├── server.ts              # Server Supabase client
│   ├── middleware.ts          # Session middleware
│   ├── actions.ts             # Server actions for mutations
│   └── queries.ts             # Server queries for data fetching
├── types.ts                   # TypeScript type definitions
└── utils.ts                   # Utility functions

scripts/
├── 001_create_profiles.sql      # Profiles table
├── 002_profile_trigger.sql      # Auto-create profile on signup
├── 003_create_podcasts.sql      # Podcasts table
├── 004_create_episodes.sql      # Episodes table
├── 005_create_follows.sql       # Follows/social graph
├── 006_create_subscriptions.sql # Podcast subscriptions
└── 007_create_listens.sql       # Analytics/listens tracking
```

## Database Schema

### Tables
- **profiles**: User profiles with metadata
- **podcasts**: Podcast shows
- **episodes**: Individual episodes with audio files
- **follows**: User social connections
- **podcast_subscriptions**: User podcast subscriptions
- **listens**: Analytics data for episode plays

All tables have Row Level Security (RLS) policies enabled to ensure users can only access their own data.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel Blob storage configured

### Setup

1. **Clone and install**
```bash
npm install
```

2. **Environment variables**
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BLOB_READ_WRITE_TOKEN=your_blob_token
```

3. **Run database migrations**
Execute the SQL scripts in `scripts/` folder in order (001-007) in your Supabase dashboard.

4. **Start development**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## API Routes

### Podcasts
- `POST /api/podcasts` - Create podcast
- `GET /api/podcasts` - Get all published podcasts
- `GET /api/podcasts/[id]` - Get podcast details

### Episodes
- `POST /api/episodes` - Create episode
- `GET /api/episodes` - Get episodes by podcast

### Audio & Files
- `POST /api/upload/audio` - Upload audio file
- `POST /api/upload/image` - Upload image file
- `GET /api/file` - Serve private blob files

### Social
- `POST /api/follows` - Follow user
- `DELETE /api/follows` - Unfollow user
- `POST /api/subscriptions` - Subscribe to podcast
- `DELETE /api/subscriptions` - Unsubscribe from podcast

### Analytics
- `POST /api/analytics/listen` - Track episode listen

## Features Implemented

✅ User authentication with email/password  
✅ User profiles with follow system  
✅ Podcast creation and management  
✅ Episode upload with audio storage  
✅ Podcast discovery and browsing  
✅ Audio player with controls  
✅ Podcast subscriptions  
✅ Listen tracking and analytics  
✅ Analytics dashboard with charts  
✅ Public podcast profiles  
✅ Creator profiles with statistics  
✅ Search and category filtering  

## RLS Security

All database tables are protected with Row Level Security policies:
- Users can only view published podcasts from other creators
- Users can only edit their own podcasts and episodes
- Users can only view their own listening history
- Social data (follows, subscriptions) is properly scoped to users

## Deployment

Deploy to Vercel for automatic deployment from Git:

```bash
vercel deploy
```

Environment variables are automatically synced from your Vercel project settings.

## Future Enhancements

- Email notifications for new episodes
- Advanced search with full-text search
- Podcast RSS feed generation
- Recommendations based on listening history
- Sponsorship/monetization features
- Download episodes for offline listening
- Transcription generation
- Social sharing
- Podcast statistics and insights

## Support

For issues or questions, please open an issue in the repository.
