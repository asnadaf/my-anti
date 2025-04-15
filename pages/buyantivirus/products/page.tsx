import { ProductsContent } from "@/components/pages/ProductsContent";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Genuine Antivirus License Keys | SecureKeyMaster - Best Prices & Instant Delivery',
  description: 'Buy 100% authentic antivirus license keys from Norton, McAfee, Bitdefender & more. Instant delivery, 24/7 support, and best prices guaranteed. Protect up to 10 devices.',
  keywords: 'antivirus license key, Norton 360, McAfee, Bitdefender, Kaspersky, ESET, Avast, security software, virus protection, genuine license, instant delivery',
  openGraph: {
    title: 'Genuine Antivirus License Keys | SecureKeyMaster',
    description: 'Buy authentic antivirus license keys with instant delivery and 24/7 support. Best prices guaranteed.',
    type: 'website',
    url: 'https://securekeymaster.com/products',
    images: [
      {
        url: '/images/og-products.jpg',
        width: 1200,
        height: 630,
        alt: 'SecureKeyMaster Antivirus Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genuine Antivirus License Keys | SecureKeyMaster',
    description: 'Buy authentic antivirus license keys with instant delivery and 24/7 support.',
    images: ['/images/twitter-products.jpg'],
  },
  alternates: {
    canonical: 'https://securekeymaster.com/products',
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
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
};

// This function will be called at build time
export async function generateStaticParams() {
  // Generate static paths for all product categories
  return [
    { category: 'all' },
    { category: 'popular' },
    { category: 'under30' },
    { category: 'multidevice' },
  ];
}

// This function will be called at request time
export async function generateMetadata({ params }: { params: { category: string } }) {
  const categoryTitles = {
    all: 'All Antivirus Products',
    popular: 'Popular Antivirus Software',
    under30: 'Budget Antivirus Solutions',
    multidevice: 'Multi-Device Protection',
  };

  return {
    title: `${categoryTitles[params.category as keyof typeof categoryTitles]} | SecureKeyMaster`,
    description: `Browse our selection of ${params.category} antivirus license keys. 100% genuine, instant delivery, and best prices guaranteed.`,
  };
}

export default function ProductsPage({ params }: { params: { category: string } }) {
  return <ProductsContent category={params.category} />;
} 