import type { MetadataRoute } from 'next'
import { areFormationsPublished } from '@/lib/site-facts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aigile.lu'
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/manifesto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/retro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/diagnostic`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/kit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/salim`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cgv`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
  if (areFormationsPublished()) {
    entries.push(
      { url: `${base}/formations`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${base}/formations/agile-ia-demarrer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}/formations/livraison-fiable-ia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    )
  }
  return entries
}
