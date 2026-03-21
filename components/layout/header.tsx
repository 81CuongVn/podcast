'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Mic, Menu, X, Search, Bell, LayoutDashboard, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()
  const { siteTitle, publicRegistration, maintenanceMode } = useSiteSettings()

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => pathname === href

  const navLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/discover', label: 'Discover' },
    { href: '/categories', label: 'Categories' },
  ]

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "py-3 bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent shadow-xl shadow-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Mic className="h-6 w-6 text-white relative z-10" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{siteTitle}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 leading-none mt-1">Professional</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-full bg-muted/30 backdrop-blur-md border border-border/50 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 relative",
                isActive(link.href) 
                  ? "text-primary-foreground bg-primary shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50 transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          {maintenanceMode && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Maintenance mode
            </span>
          )}

          {mounted && !loading && !user && (
            <div className="flex items-center gap-3 ml-2">
              <Button variant="ghost" asChild className="font-black uppercase tracking-widest text-xs h-11 px-6 rounded-full hover:bg-muted/50">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              {publicRegistration && (
                <Button size="lg" asChild className="font-black uppercase tracking-widest text-xs h-11 px-8 rounded-full shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              )}
            </div>
          )}

          {mounted && user && (
            <div className="flex items-center gap-3 ml-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50 relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
              <div className="h-8 w-px bg-border/50 mx-2" />
              <Button variant="outline" asChild className="font-black uppercase tracking-widest text-xs h-11 px-6 rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-all group">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Dashboard
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-3 rounded-2xl bg-muted/50 text-foreground border border-border/50 shadow-sm"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-border/50 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-6 py-8 space-y-6">
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all",
                      isActive(link.href) 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </Link>
                ))}
              </div>
              
              <div className="pt-6 border-t border-border/50 space-y-4">
                {mounted && !loading && !user && (
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" size="lg" asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm border-2">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    </Button>
                    {publicRegistration && (
                      <Button size="lg" asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-purple-600">
                        <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                      </Button>
                    )}
                  </div>
                )}
                {mounted && user && (
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" size="lg" asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-primary/20 bg-primary/5">
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      onClick={handleLogout} 
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
