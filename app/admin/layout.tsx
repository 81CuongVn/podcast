'use client'

import { ReactNode, useState, useEffect } from 'react'
import { redirect, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Mic, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  Palette, 
  Languages, 
  DollarSign, 
  Megaphone, 
  Mail, 
  Search, 
  Plus, 
  Bell, 
  MessageSquare, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
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

  if (isAdmin === false) redirect('/')
  if (isAdmin === null) return null

  const menuGroups = [
    {
      title: 'SYSTEM',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
        { href: '/admin/themes', label: 'Themes', icon: Palette },
        { href: '/admin/languages', label: 'Languages', icon: Languages },
      ]
    },
    {
      title: 'USERS',
      items: [
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/groups', label: 'Users Groups', icon: Users },
      ]
    },
    {
      title: 'MODULES',
      items: [
        { href: '/admin/podcasts', label: 'Podcasts', icon: Mic },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'MONEY',
      items: [
        { href: '/admin/earnings', label: 'Earnings', icon: DollarSign },
        { href: '/admin/wallet', label: 'Wallet', icon: DollarSign },
      ]
    },
    {
      title: 'REACH',
      items: [
        { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-border transition-all duration-300 z-50 flex flex-col",
        isSidebarOpen ? "w-72" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
            <Mic className="h-6 w-6" />
          </div>
          {isSidebarOpen && (
            <span className="font-black text-2xl tracking-tighter text-primary">PodHub</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                        active 
                          ? "bg-primary/5 text-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      {isSidebarOpen && (
                        <>
                          <span className="font-bold text-sm">{item.label}</span>
                          {active && (
                            <motion.div 
                              layoutId="activeBar"
                              className="absolute right-0 w-1 h-6 bg-primary rounded-l-full"
                            />
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-4 h-12 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-4"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border/50 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-xl"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search metrics, users, podcasts..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-[#f4f7fe] border-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="h-8 w-px bg-border/50 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none">Admin</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
