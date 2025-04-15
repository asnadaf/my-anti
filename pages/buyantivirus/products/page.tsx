import ProductsContent from "@components/pages/ProductsContent";
import Head from 'next/head';

export default function ProductsPage({ params }: { params: { category: string } }) {
  const categoryTitles = {
    all: 'All Antivirus Products',
    popular: 'Popular Antivirus Software',
    under30: 'Budget Antivirus Solutions',
    multidevice: 'Multi-Device Protection',
  };

  const title = `${categoryTitles[params.category as keyof typeof categoryTitles]} | SecureKeyMaster`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Buy 100% authentic antivirus license keys from Norton, McAfee, Bitdefender & more. Instant delivery, 24/7 support, and best prices guaranteed. Protect up to 10 devices." />
        <meta name="keywords" content="antivirus license key, Norton 360, McAfee, Bitdefender, Kaspersky, ESET, Avast, security software, virus protection, genuine license, instant delivery" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Genuine Antivirus License Keys | SecureKeyMaster" />
        <meta property="og:description" content="Buy authentic antivirus license keys with instant delivery and 24/7 support. Best prices guaranteed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://securekeymaster.com/products" />
        <meta property="og:image" content="/images/og-products.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Genuine Antivirus License Keys | SecureKeyMaster" />
        <meta name="twitter:description" content="Buy authentic antivirus license keys with instant delivery and 24/7 support." />
        <meta name="twitter:image" content="/images/twitter-products.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://securekeymaster.com/products" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
        
        {/* Verification */}
        <meta name="google-site-verification" content="your-google-site-verification" />
        <meta name="yandex-verification" content="your-yandex-verification" />
        <meta name="yahoo-verification" content="your-yahoo-verification" />
      </Head>
      <ProductsContent category={params.category} />
    </>
  );
} 