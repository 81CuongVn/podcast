import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { PlayerProvider } from '@/lib/player-context'
import { GlobalPlayer } from '@/components/podcast/global-player'

export const metadata: Metadata = {
  title: 'PodHub - The Professional Podcast Hosting & Distribution Platform',
  description: 'Create, host, and distribute your podcasts to Spotify, Apple Podcasts, and more. Advanced analytics, professional tools, and a global audience await you on PodHub.',
  keywords: 'podcast hosting, podcast distribution, create podcast, podcast analytics, podcast platform, audio streaming',
  authors: [{ name: 'PodHub Team' }],
  openGraph: {
    title: 'PodHub - Create & Share Podcasts',
    description: 'Discover amazing podcasts and build your audience on the world\'s most professional hosting platform.',
    type: 'website',
    url: 'https://podhub.com',
    siteName: 'PodHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PodHub - Professional Podcast Platform',
    description: 'The all-in-one platform for modern storytellers.',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <PlayerProvider>
          {children}
          <Toaster position="top-center" />
          <GlobalPlayer />
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
