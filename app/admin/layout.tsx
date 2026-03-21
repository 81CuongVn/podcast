'use client'

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { redirect, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  ChevronLeft,
  LayoutDashboard,
  Settings,
  Users,
  Mic,
  BarChart3,
  Palette,
  Languages,
  DollarSign,
  Megaphone,
  Mail,
  Search,
  Bell,
  MessageSquare,
  LogOut,
  Menu,
  X,
  CheckCheck,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/hooks/use-site-settings'

const initialNotifications = [
  { id: '1', title: 'New user registered', body: 'A new creator signed up 2 hours ago.', icon: 'info', time: '2h ago', read: false },
  { id: '2', title: 'Theme updated', body: 'Vibrant Pulse theme was activated.', icon: 'info', time: '5h ago', read: false },
  { id: '3', title: 'Storage warning', body: 'Media storage is at 78% capacity.', icon: 'warning', time: '1d ago', read: true },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const notifRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { siteTitle } = useSiteSettings()

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsAdmin(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAdmin(!!profile?.is_admin)
    }

    checkAdmin()
  }, [supabase])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)')

    const syncLayout = (matches: boolean) => {
      setIsMobile(matches)
      setIsSidebarOpen(!matches)
    }

    syncLayout(media.matches)

    const handleChange = (event: MediaQueryListEvent) => syncLayout(event.matches)
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false)
  }, [pathname, isMobile])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  const menuGroups = useMemo(
    () => [
      {
        title: 'System',
        items: [
          { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
          { href: '/admin/themes', label: 'Themes', icon: Palette },
          { href: '/admin/languages', label: 'Languages', icon: Languages },
        ],
      },
      {
        title: 'Users',
        items: [
          { href: '/admin/users', label: 'Users', icon: Users },
          { href: '/admin/groups', label: 'Groups', icon: Users },
        ],
      },
      {
        title: 'Modules',
        items: [
          { href: '/admin/podcasts', label: 'Podcasts', icon: Mic },
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        ],
      },
      {
        title: 'Revenue',
        items: [
          { href: '/admin/earnings', label: 'Earnings', icon: DollarSign },
          { href: '/admin/wallet', label: 'Wallet', icon: DollarSign },
        ],
      },
      {
        title: 'Reach',
        items: [
          { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
          { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
        ],
      },
    ],
    []
  )

  if (isAdmin === false) redirect('/')
  if (isAdmin === null) return null

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      {isMobile && isSidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:shadow-none',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">{siteTitle} Admin</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Control center</p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b border-slate-200 px-5 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search admin modules"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-xl transition',
                          active ? 'bg-white text-primary shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span>{item.label}</span>
                      {active && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute right-3 h-2 w-2 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 p-4">
          <Button
            variant="ghost"
            className="h-12 w-full justify-start gap-3 rounded-2xl px-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span className="font-semibold">Sign out</span>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:min-h-screen">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setIsSidebarOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden min-w-0 flex-1 md:block">
              <p className="truncate text-sm font-semibold text-slate-500">
                {pathname === '/admin' ? 'Dashboard overview' : pathname.replace('/admin/', '').replaceAll('/', ' / ')}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Button asChild variant="outline" className="hidden h-10 rounded-2xl border-slate-200 px-4 font-semibold lg:inline-flex">
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to homepage
                </Link>
              </Button>
              <div ref={notifRef} className="relative">
                <Button variant="ghost" size="icon" className="relative rounded-xl text-slate-500" onClick={() => setNotifOpen((v) => !v)}>
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </Button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                      <p className="text-sm font-bold text-slate-950">Notifications</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                      {notifications.map((n) => (
                        <div key={n.id} className={cn('flex items-start gap-3 px-5 py-4 transition', n.read ? 'opacity-60' : 'bg-blue-50/40')}>
                          <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', n.icon === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500')}>
                            {n.icon === 'warning' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-400">{n.time}</p>
                          </div>
                          {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-500">
                <MessageSquare className="h-4.5 w-4.5" />
              </Button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-slate-950">Admin</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Super admin</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg shadow-primary/20" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-4 lg:hidden">
              <Button asChild variant="outline" className="h-10 rounded-2xl border-slate-200 px-4 font-semibold">
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to homepage
                </Link>
              </Button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
