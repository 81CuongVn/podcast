import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { getUserProfile } from '@/lib/supabase/queries'
import { PodcastForm } from '@/components/forms/podcast-form'

export default async function NewPodcastPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const profile = await getUserProfile()

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={profile} />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Podcast</h1>
          <p className="text-muted-foreground mt-2">Start your podcasting journey</p>
        </div>

        <PodcastForm />
      </main>
    </div>
  )
}
