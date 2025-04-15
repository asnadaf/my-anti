import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://keyguardian.com'),
  title: {
    default: 'Key Guardian - Secure Your Digital Keys',
    template: '%s | Key Guardian - #1 Digital Key Security Platform'
  },
  description: 'Protect your digital keys and licenses with our advanced security solutions. The most trusted platform for secure key management, trusted by 10,000+ businesses worldwide.',
  keywords: [
    'digital keys', 'license management', 'key security', 'software licenses', 
    'digital asset protection', 'secure key storage', 'key management system',
    'software license management', 'digital key protection', 'secure license storage'
  ],
  authors: [{ name: 'Key Guardian Team' }],
  creator: 'Key Guardian',
  publisher: 'Key Guardian',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://keyguardian.com',
    siteName: 'Key Guardian',
    title: 'Key Guardian - Secure Your Digital Keys',
    description: 'Protect your digital keys and licenses with our advanced security solutions. The most trusted platform for secure key management.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Key Guardian - Secure Your Digital Keys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Key Guardian - Secure Your Digital Keys',
    description: 'Protect your digital keys and licenses with our advanced security solutions. The most trusted platform for secure key management.',
    images: ['/twitter-image.jpg'],
    creator: '@keyguardian',
    site: '@keyguardian',
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
  alternates: {
    canonical: 'https://keyguardian.com',
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
  category: 'Security Software',
  classification: 'Digital Key Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Key Guardian",
              "applicationCategory": "SecurityApplication",
              "operatingSystem": "Web",
              "description": "Protect your digital keys and licenses with our advanced security solutions",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "10000"
              },
              "review": {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "John Doe"
                },
                "reviewBody": "The best key management solution I've ever used!"
              }
            })
          }}
        />
      </Head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}