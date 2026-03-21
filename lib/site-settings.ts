export type SiteSettings = {
  siteTitle: string
  siteDescription: string
  siteDomain: string
  twitterUrl: string
  instagramUrl: string
  contactEmail: string
  backgroundImage: string
  primaryColor: string
  glassmorphism: boolean
  darkMode: boolean
  mobileNav: boolean
  publicRegistration: boolean
  emailVerification: boolean
  moderatorDashboard: boolean
  maintenanceMode: boolean
  googleAnalyticsId: string
  facebookPixelId: string
  seoKeywords: string
  customCss: string
  customJs: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'PodStream',
  siteDescription: 'The professional podcast platform for creators and listeners.',
  siteDomain: 'podcast.hamhochoi.com',
  twitterUrl: 'https://twitter.com/johnweek45',
  instagramUrl: '',
  contactEmail: 'support@podstream.com',
  backgroundImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
  primaryColor: '#6366f1',
  glassmorphism: true,
  darkMode: true,
  mobileNav: true,
  publicRegistration: true,
  emailVerification: true,
  moderatorDashboard: false,
  maintenanceMode: false,
  googleAnalyticsId: '',
  facebookPixelId: '',
  seoKeywords: 'podcast, audio, creator, streaming, music',
  customCss: '',
  customJs: '',
}

export function mergeSiteSettings(
  incoming?: Partial<SiteSettings> | null
): SiteSettings {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...incoming,
  }
}

export function parseSiteSettings(
  rawValue?: string | null
): SiteSettings {
  if (!rawValue) return DEFAULT_SITE_SETTINGS

  try {
    const parsed = JSON.parse(rawValue) as Partial<SiteSettings>
    return mergeSiteSettings(parsed)
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export function serializeSiteSettings(settings: SiteSettings): string {
  return JSON.stringify(settings)
}
