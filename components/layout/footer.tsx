import Link from 'next/link'
import { Headphones, Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Headphones className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PodStream</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create and share podcasts with the world. Discover amazing shows from creators everywhere.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Podcasts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground transition-colors hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/browse?sort=trending" className="text-muted-foreground transition-colors hover:text-foreground">
                  Trending
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="mb-4 font-semibold">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/create" className="text-muted-foreground transition-colors hover:text-foreground">
                  Start a Podcast
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-muted-foreground transition-colors hover:text-foreground">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <div className="mb-4 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/sign-up" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} PodStream. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
