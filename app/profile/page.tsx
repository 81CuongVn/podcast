import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

async function getUserStats(userId: string) {
  const supabase = await createClient()

  const { data: podcasts } = await supabase
    .from('podcasts')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)

  const { data: subscribers } = await supabase
    .from('subscriptions')
    .select('id', { count: 'exact' })
    .in('podcast_id', podcasts?.map((p) => p.id) || [])

  const { data: followers } = await supabase
    .from('follows')
    .select('id', { count: 'exact' })
    .eq('following_id', userId)

  return {
    podcasts: podcasts?.length || 0,
    subscribers: subscribers?.length || 0,
    followers: followers?.length || 0,
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getUserProfile(user.id)
  const stats = await getUserStats(user.id)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            PodHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/discover">
              <Button variant="outline" size="sm">
                Discover
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <form action="/auth/logout" method="POST">
              <Button type="submit" variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl">
          <Card className="p-8">
            <div className="flex items-start gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-24 h-24 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  {profile?.display_name || 'User'}
                </h1>
                <p className="text-muted-foreground mt-2">{user.email}</p>

                <div className="grid grid-cols-3 gap-8 mt-8">
                  <div>
                    <p className="text-2xl font-bold">{stats.podcasts}</p>
                    <p className="text-sm text-muted-foreground">Podcasts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.subscribers}</p>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link href="/dashboard">
                    <Button>Manage Podcasts</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
