/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost','picsum.photos','fastly.picsum.photos','example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
        pathname: '/images/**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config, { isServer }) => {
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

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.resolve.modules = ['node_modules', '.'];
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];

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
  },
  poweredByHeader: false,
  generateEtags: false,
  distDir: '.next',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx']
}

module.exports = nextConfig 