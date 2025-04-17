/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/buyantivirus/products/:slug*',
        destination: '/buyantivirus',
        permanent: true,
      },
      {
        source: '/products/:slug*',
        destination: '/buyantivirus',
        permanent: true,
      }
    ];
  },
  images: {
    domains: ['localhost','picsum.photos','fastly.picsum.photos','example.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@components': './components',
      '@hooks': './hooks',
      '@lib': './lib',
      '@models': './models',
      '@styles': './styles',
      '@public': './public'
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 