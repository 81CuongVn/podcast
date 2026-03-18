'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Mic className="h-5 w-5" />
          <span>PodHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-sm hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            Discover
          </Link>
          {mounted && user && (
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && !loading && !user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </>
          )}
          {mounted && user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">My Podcasts</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
          {!mounted && (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
