import type { MetadataRoute } from 'next'
 
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://vaidteam.com/sitemap.xml',
  }
}
