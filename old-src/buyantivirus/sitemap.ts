import { MetadataRoute } from 'next'

type ChangeFreq = 'daily' | 'monthly' | 'weekly' | 'always' | 'hourly' | 'yearly' | 'never'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://keyguardian.com'
  
  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.9,
    },
  ]

  // Define dynamic routes (example: blog posts)
  const blogPosts = [
    'how-to-secure-digital-keys',
    'best-practices-for-license-management',
    'digital-key-security-guide',
    'protecting-software-licenses',
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFreq,
    priority: 0.8,
  }))

  // Define category pages
  const categories = [
    'security',
    'management',
    'best-practices',
    'tutorials',
  ].map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFreq,
    priority: 0.7,
  }))

  // Combine all routes
  return [...staticRoutes, ...blogPosts, ...categories]
} 