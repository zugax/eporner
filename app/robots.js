import { headers } from 'next/headers';

export async function robots() {
  const headersList = await headers();
  const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'pornxsearch.dpdns.org';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'https';
  const siteUrl = `${protocol}://${host}`;
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/404',
          '/500',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'MSNBot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
