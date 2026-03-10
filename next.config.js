/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n configuration for Indonesia targeting - disabled to avoid 404 errors
  // i18n: {
  //   locales: ['id', 'en'],
  //   defaultLocale: 'id',
  //   localeDetection: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.eporner.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.eporner.com',
      },
      {
        protocol: 'https',
        hostname: 'static-ca-cdn.eporner.com',
      },
      {
        protocol: 'https',
        hostname: 'static-eporner-comcdn.epercdn.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
      '@components': require('path').resolve(__dirname, 'components'),
      '@lib': require('path').resolve(__dirname, 'lib'),
    }
    return config
  },
  // SEO optimizations
  compress: true,
  poweredByHeader: false,
  
  // trailingSlash: true,
}

module.exports = nextConfig
