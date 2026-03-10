import { Metadata } from 'next'
 
export const metadata = {
  metadataBase: new URL('https://pornxsearch.dpdns.org'),
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
    canonical: 'https://pornxsearch.dpdns.org',
    languages: {
      'en-US': 'https://pornxsearch.dpdns.org',
      'id': 'https://pornxsearch.dpdns.org',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pornxsearch.dpdns.org',
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
  const baseUrl = 'https://pornxsearch.dpdns.org'
 
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
    // Main Eporner categories
    'all', '4k-porn', 'anal', 'teens', 'pov-porn', 'threesome', 'japanese', 
    'lesbians', 'asian', 'redhead', 'vr-porn', 'mature', 'interracial', 
    'big-tits', 'milf', 'hardcore', 'group-sex', 'amateur', 'orgy', 'gay',
    // Additional popular categories
    'blowjob', 'handjob', 'foot-fetish', 'voyeur', 'public', 'office', 
    'hotel', 'casting', 'hd-porn', 'verified-amateurs', 'pornstar', 
    'celebrity', 'ebony', 'latina', 'whitegirl', 'bbw', 'skinny',
    // Asian categories
    'indo', 'hijab', 'jepang', 'malaysia', 'thailand', 'vietnam',
    'filipina', 'korea', 'china', 'singapore', 'taiwan', 'hong-kong',
    // Niche categories
    'mom', 'stepmom', 'stepdaughter', 'sister', 'babysitter', 'maid',
    'teacher', 'student', 'doctor', 'nurse', 'police', 'military',
    'fetish', 'bdsm', 'domination', 'submission', 'latex', 'leather',
    'Uniform', 'cosplay', 'cartoon', 'hentai', 'anime', '3d',
    'compilation', 'best-of', 'most-viewed', 'top-rated', 'longest',
    // More specific
    'teen-18-19', 'young', 'college', 'brunette', 'blonde', 'redhead',
    'piercing', 'tattoo', 'natural-tits', 'fake-tits', 'big-ass', 
    'small-tits', 'huge-tits', 'anal-double', 'double-penetration',
    'gagging', 'deep-throat', 'creampie', 'facial', 'cumshot', 'internal',
    'squirt', 'gspot', 'toys', 'dildo', 'vibrator', 'massage',
    'striptease', 'webcam', 'live', 'vr', '4k', 'hd', 'vr-porn',
    // Indian & Pakistani
    'india', 'pakistani', 'bollywood', 'hindi',
    // Arabic/Middle East
    'arab', 'middle-east', 'egyptian',
    // European
    'european', 'british', 'french', 'german', 'italian', 'russian',
    // South American
    'brazilian', 'colombian', 'argentinian', 'mexican',
    // Extra
    'solo', 'masturbation', 'teen', 'young-teen', 'old-young'
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
