export type SiteSettings = {
  siteTitle: string
  siteDescription: string
  siteDomain: string
  publicRegistration: boolean
  maintenanceMode: boolean
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'PodStream',
  siteDescription: 'The professional podcast platform for creators and listeners.',
  siteDomain: 'podcast.hamhochoi.com',
  publicRegistration: true,
  maintenanceMode: false,
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
