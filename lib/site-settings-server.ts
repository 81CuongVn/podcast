import { createClient } from '@/lib/supabase/server'
import {
  DEFAULT_SITE_SETTINGS,
  mergeSiteSettings,
  type SiteSettings,
} from '@/lib/site-settings'

export async function getSiteSettingsServer(): Promise<SiteSettings> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_settings')
    .select(
      'site_title, site_description, site_domain, public_registration, maintenance_mode'
    )
    .eq('id', 1)
    .single()

  if (!data) return DEFAULT_SITE_SETTINGS

  return mergeSiteSettings({
    siteTitle: data.site_title,
    siteDescription: data.site_description,
    siteDomain: data.site_domain,
    publicRegistration: data.public_registration,
    maintenanceMode: data.maintenance_mode,
  })
}
