import { Metadata } from 'next'
 
export const metadata = {
  metadataBase: new URL('https://areabokep.me'),
  title: {
    default: 'AREA BOKEP - Streaming Video Bokep Indonesia Gratis',
    template: '%s | AREA BOKEP'
  },
  description: 'Nonton video bokep Indonesia, jav, dan western gratis dalam kualitas HD. Update harian dengan koleksi video porn terupdate.',
  keywords: ['bokep', 'video bokep', 'bokep indonesia', 'bokep japan', 'jav', 'porn', 'hd porn', 'streaming bokep', 'download bokep', 'bokep gratis'],
  authors: [{ name: 'AREA BOKEP' }],
  creator: 'AREA BOKEP',
  publisher: 'AREA BOKEP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://areabokep.me',
    languages: {
      'en-US': 'https://areabokep.me',
      'id': 'https://areabokep.me',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://areabokep.me',
    siteName: 'AREA BOKEP',
    title: 'AREA BOKEP - Streaming Video Bokep Indonesia Gratis',
    description: 'Nonton video bokep Indonesia, jav, dan western gratis dalam kualitas HD. Update harian dengan koleksi video porn terupdate.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AREA BOKEP - Streaming Video Bokep Gratis',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AREA BOKEP - Streaming Video Bokep Indonesia Gratis',
    description: 'Nonton video bokep Indonesia, jav, dan western gratis dalam kualitas HD.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}
 
export default async function sitemap() {
  const baseUrl = 'https://areabokep.me'
 
  // Static pages
  const staticPages = [
    '',
    '/trending',
    '/popular',
    '/latest',
    '/categories',
    '/pornstars',
    '/channels',
    '/search',
    '/terms',
    '/privacy',
    '/dmca',
    '/contact',
  ]
 
  // Categories for dynamic pages - Indonesian keywords
  const categories = [
    // Main categories
    'indonesian', 'asian', 'japanese', 'milf', 'teen', 'big-tits', 
    'anal', 'blowjob', 'hardcore', 'amateur', 'massage', 'lesbian',
    'threesome', 'group-sex', 'public', 'office', 'hotel', 'vr-porn',
    // Indonesian keywords
    'indo', 'hijab', 'jepang', 'malaysia', 'thailand', 'vietnam',
    'filipina', 'korea', 'china', 'singapore'
  ]
 
  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
 
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))
 
  return [
    ...staticRoutes,
    ...categoryRoutes,
  ]
}
