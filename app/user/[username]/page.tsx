import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Users, Globe, MapPin } from 'lucide-react'

export const revalidate = 300

export default async function UserProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  // Get user's published podcasts
  const { data: podcasts } = await supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('user_id', profile.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Get follower/following counts
  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', profile.id)

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profile.id)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container max-w-screen-2xl py-12">
          {/* Profile Header */}
          <Card className="p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="text-3xl font-bold text-muted-foreground">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{profile.display_name || profile.username}</h1>
                <p className="text-muted-foreground text-lg mb-4">@{profile.username}</p>
                {profile.bio && <p className="text-base mb-4">{profile.bio}</p>}

                {/* Links */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {profile.website_url}
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-6">
                  <div>
                    <p className="text-2xl font-bold">{podcasts?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Podcasts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{followerCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{followingCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button size="lg">Follow</Button>
              </div>
            </div>
          </Card>

          {/* Podcasts */}
          {podcasts && podcasts.length > 0 ? (
            <PodcastGrid podcasts={podcasts} title="Podcasts" />
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">This creator hasn't published any podcasts yet</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
