'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Mic, BarChart3, User, LogOut, Plus, Headphones, Home, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        setIsAdmin(!!data?.is_admin)
      }
    }
    checkAdmin()
  }, [supabase])

  const items = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'My Podcasts',
      href: '/dashboard/podcasts',
      icon: Mic,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: 'Profile',
      href: '/dashboard/profile',
      icon: User,
    },
  ]

  if (isAdmin) {
    items.push({
      title: 'Admin Panel',
      href: '/admin',
      icon: ShieldAlert,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Headphones className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold text-sidebar-foreground">PodStream</span>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button asChild className="w-full gap-2">
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4" />
            New Podcast
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link href="/">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50">
            <Home className="h-4 w-4" />
            Back to Home
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
