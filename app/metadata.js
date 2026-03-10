import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = typeof headers === 'function' ? await headers() : {};
  const host = headersList.host || headersList['x-forwarded-host'] || 'areabokep.me';
  const hostname = host.replace(/^www\./, '');
  const baseUrl = `https://${hostname}`;

  const isMainDomain = hostname === 'areabokep.me';
  const siteName = isMainDomain ? 'AREA BOKEP' : 'PornXSearch';
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: isMainDomain 
        ? 'AREA BOKEP - Video Bokep Indonesia Indo Hijab Japan Gratis HD'
        : 'PornXSearch - Free HD Adult Video Search',
      template: isMainDomain ? '%s | AREA BOKEP' : '%s | PornXSearch'
    },
    description: isMainDomain
      ? 'Nonton video bokep indonesia, bokep indo, bokep hijab, bokep jepang (jav) gratis dalam kualitas HD. Koleksi video bokep terupdate dan terlengkap.'
      : 'Search and watch free HD adult videos. Find the best porn videos from top categories.',
    keywords: [
      'bokep',
      'bokep indonesia',
      'bokep indo',
      'bokep hijab',
      'bokep jepang',
      'jav',
      'video bokep',
      'bokep gratis',
      'bokep hot',
      'bokep viral',
      'streaming bokep',
      'nonton bokep',
      'download bokep',
      'porn',
      'hd porn',
      'adult video',
      'free porn',
      'porn search'
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-US': baseUrl,
        'id': baseUrl,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: siteName,
      title: isMainDomain
        ? 'AREA BOKEP - Video Bokep Indonesia Indo Hijab Japan Gratis HD'
        : 'PornXSearch - Free HD Adult Video Search',
      description: isMainDomain
        ? 'Nonton video bokep indonesia, bokep indo, bokep hijab, bokep jepang (jav) gratis dalam kualitas HD.'
        : 'Search and watch free HD adult videos. Find the best porn videos from top categories.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: isMainDomain ? 'AREA BOKEP - Video Bokep Gratis' : 'PornXSearch - Free Adult Video Search',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isMainDomain
        ? 'AREA BOKEP - Video Bokep Indonesia Indo Hijab Japan Gratis HD'
        : 'PornXSearch - Free HD Adult Video Search',
      description: isMainDomain
        ? 'Nonton video bokep indonesia, bokep indo, bokep hijab, bokep jepang (jav) gratis dalam kualitas HD.'
        : 'Search and watch free HD adult videos. Find the best porn videos from top categories.',
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
  }
}
