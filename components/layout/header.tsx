'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Mic, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline font-semibold">PodStream</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/browse" 
            className={`text-sm font-medium transition-colors ${isActive('/browse') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Browse
          </Link>
          <Link 
            href="/discover" 
            className={`text-sm font-medium transition-colors ${isActive('/discover') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Discover
          </Link>
          <Link 
            href="/categories" 
            className={`text-sm font-medium transition-colors ${isActive('/categories') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Categories
          </Link>
          {mounted && user && (
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && !loading && !user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="font-medium">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </>
          )}
          {mounted && user && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
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

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          <Link 
            href="/browse" 
            className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Browse
          </Link>
          <Link 
            href="/discover" 
            className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Discover
          </Link>
          <Link 
            href="/categories" 
            className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Categories
          </Link>
          {mounted && user && (
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Dashboard
            </Link>
          )}
          
          <div className="border-t pt-3 mt-3 space-y-2">
            {mounted && !loading && !user && (
              <>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="w-full font-medium">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </>
            )}
            {mounted && user && (
              <>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
