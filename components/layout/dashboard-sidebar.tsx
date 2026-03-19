'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Mic, BarChart3, User, LogOut, Plus, Headphones, Home, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <div className={cn(
      "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center gap-2 border-b border-sidebar-border transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "px-6"
      )}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
          <Headphones className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && <span className="font-bold text-sidebar-foreground truncate">PodStream</span>}
      </div>

      {/* Create Button */}
      <div className="p-4">
        {isCollapsed ? (
          <Button asChild size="icon" className="w-full h-10 rounded-xl">
            <Link href="/dashboard/create">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full gap-2 rounded-xl h-10">
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4" />
              New Podcast
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} title={isCollapsed ? item.title : ""}>
              <div
                className={cn(
                  'flex items-center rounded-xl py-2 text-sm font-medium transition-all duration-300',
                  isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link href="/" title={isCollapsed ? "Back to Home" : ""}>
          <div className={cn(
            "flex items-center rounded-xl py-2 text-sm font-medium text-sidebar-foreground transition-all duration-300 hover:bg-sidebar-accent/50",
            isCollapsed ? "justify-center px-0" : "px-3 gap-3"
          )}>
            <Home className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Back to Home</span>}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Sign Out" : ""}
          className={cn(
            "flex w-full items-center rounded-xl py-2 text-sm font-medium text-destructive transition-all duration-300 hover:bg-destructive/10",
            isCollapsed ? "justify-center px-0" : "px-3 gap-3"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </div>
  )
}
