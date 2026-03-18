'use client'

import Link from 'next/link'
import { LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NavBarProps {
  user?: {
    id: string
    email: string
  }
}

export function NavBar({ user }: NavBarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              P
            </div>
            <span className="hidden sm:inline">PodHub</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link href="/" className="transition-colors hover:text-primary">
              Discover
            </Link>
            <Link href="/categories" className="transition-colors hover:text-primary">
              Categories
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <Link href={`/profile/${user.id}`} className="transition-colors hover:text-primary">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="/" className="transition-colors hover:text-primary">
                Discover
              </Link>
              <Link href="/categories" className="transition-colors hover:text-primary">
                Categories
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href={`/profile/${user.id}`} className="transition-colors hover:text-primary">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="transition-colors hover:text-primary"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
