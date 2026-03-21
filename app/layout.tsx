import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { PlayerProvider } from '@/lib/player-context'
import { GlobalPlayer } from '@/components/podcast/global-player'
import { SiteSettingsSync } from '@/components/site-settings-sync'
import { getSiteSettingsServer } from '@/lib/site-settings-server'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer()
  const siteUrl = settings.siteDomain.startsWith('http')
    ? settings.siteDomain
    : `https://${settings.siteDomain}`

  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords:
      'podcast hosting, podcast distribution, create podcast, podcast analytics, podcast platform, audio streaming',
    authors: [{ name: `${settings.siteTitle} Team` }],
    openGraph: {
      title: `${settings.siteTitle} - Create & Share Podcasts`,
      description: settings.siteDescription,
      type: 'website',
      url: siteUrl,
      siteName: settings.siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.siteTitle} - Professional Podcast Platform`,
      description: settings.siteDescription,
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
          <SiteSettingsSync />
          {children}
          <Toaster position="top-center" />
          <GlobalPlayer />
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
