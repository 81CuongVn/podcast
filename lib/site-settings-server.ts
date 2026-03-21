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
      'site_title, site_description, site_domain, twitter_url, instagram_url, contact_email, background_image, primary_color, glassmorphism, dark_mode, mobile_nav, public_registration, email_verification, moderator_dashboard, maintenance_mode, google_analytics_id, facebook_pixel_id, seo_keywords, custom_css, custom_js'
    )
    .eq('id', 1)
    .single()

  if (!data) return DEFAULT_SITE_SETTINGS

  return mergeSiteSettings({
    siteTitle: data.site_title,
    siteDescription: data.site_description,
    siteDomain: data.site_domain,
    twitterUrl: data.twitter_url,
    instagramUrl: data.instagram_url,
    contactEmail: data.contact_email,
    backgroundImage: data.background_image,
    primaryColor: data.primary_color,
    glassmorphism: data.glassmorphism,
    darkMode: data.dark_mode,
    mobileNav: data.mobile_nav,
    publicRegistration: data.public_registration,
    emailVerification: data.email_verification,
    moderatorDashboard: data.moderator_dashboard,
    maintenanceMode: data.maintenance_mode,
    googleAnalyticsId: data.google_analytics_id,
    facebookPixelId: data.facebook_pixel_id,
    seoKeywords: data.seo_keywords,
    customCss: data.custom_css,
    customJs: data.custom_js,
  })
}
