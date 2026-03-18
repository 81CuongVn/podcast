import Link from 'next/link'
import { Headphones, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Headphones className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>PodStream</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create and share podcasts with the world. Discover amazing shows from creators everywhere. Build your audience and grow together.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@podstream.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="mb-4 font-semibold text-sm uppercase tracking-wide text-foreground">Discover</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground transition-colors hover:text-primary">
                  Browse Podcasts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground transition-colors hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/discover" className="text-muted-foreground transition-colors hover:text-primary">
                  Featured Shows
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=popular" className="text-muted-foreground transition-colors hover:text-primary">
                  Popular
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="mb-4 font-semibold text-sm uppercase tracking-wide text-foreground">For Creators</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/auth/sign-up" className="text-muted-foreground transition-colors hover:text-primary">
                  Create Podcast
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-muted-foreground transition-colors hover:text-primary">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subscriptions" className="text-muted-foreground transition-colors hover:text-primary">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-sm uppercase tracking-wide text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="text-muted-foreground transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground transition-colors hover:text-primary">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PodStream. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ by podcast creators, for podcast creators.
          </p>
        </div>
      </div>
    </footer>
  )
}
