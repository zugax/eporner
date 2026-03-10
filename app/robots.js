export default function robots() {
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
    ],
    sitemap: 'https://areabokep.me/sitemap.xml',
    host: 'https://areabokep.me',
  }
}
