/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/client/*', '/api/*'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    ],
  },
  exclude: ['/admin/*', '/client/*', '/api/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  generateIndexSitemap: false,
} 