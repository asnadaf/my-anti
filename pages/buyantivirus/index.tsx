import Head from 'next/head';
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ProductSection from "./components/ProductSection";
import BenefitsSection from "./components/BenefitsSection";
import TrustSection from "./components/TrustSection";
import FaqSection from "./components/FaqSection";
import Footer from "@components/Footer";

export default function BuyAntivirusPage() {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Buy Antivirus Software | SecureKeyMaster",
    "url": "https://securekeymaster.com/buyantivirus",
    "description": "Browse and purchase premium antivirus software solutions. Compare features, prices, and protection levels to find the perfect security for your devices."
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Product",
        "name": "Norton 360 Deluxe",
        "description": "Complete protection for up to 5 devices with secure VPN and dark web monitoring.",
        "brand": {
          "@type": "Brand",
          "name": "Norton"
        },
        "offers": {
          "@type": "Offer",
          "price": "29.99",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Product",
        "name": "McAfee Total Protection",
        "description": "Advanced security suite with identity protection for up to 10 devices.",
        "brand": {
          "@type": "Brand",
          "name": "McAfee"
        },
        "offers": {
          "@type": "Offer",
          "price": "34.99",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Product",
        "name": "Bitdefender Total Security",
        "description": "Premium protection against all cyber threats for up to 5 devices.",
        "brand": {
          "@type": "Brand",
          "name": "Bitdefender"
        },
        "offers": {
          "@type": "Offer",
          "price": "32.99",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Buy Antivirus Software | Premium Protection for All Devices | SecureKeyMaster</title>
        <meta name="title" content="Buy Antivirus Software | Premium Protection for All Devices | SecureKeyMaster" />
        <meta name="description" content="Compare and purchase the best antivirus software for your needs. Real-time protection, multi-device security, and 24/7 expert support. Protect against malware, ransomware, and cyber threats." />
        <meta name="keywords" content="buy antivirus, antivirus software, cybersecurity, malware protection, ransomware protection, internet security, computer security, virus protection, digital security, online protection, secure browsing" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://securekeymaster.com/buyantivirus" />
        <meta property="og:title" content="Buy Antivirus Software | Premium Protection for All Devices" />
        <meta property="og:description" content="Compare and purchase the best antivirus software for your needs. Real-time protection, multi-device security, and 24/7 expert support." />
        <meta property="og:image" content="https://securekeymaster.com/images/buyantivirus-og.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://securekeymaster.com/buyantivirus" />
        <meta property="twitter:title" content="Buy Antivirus Software | Premium Protection for All Devices" />
        <meta property="twitter:description" content="Compare and purchase the best antivirus software for your needs. Real-time protection, multi-device security, and 24/7 expert support." />
        <meta property="twitter:image" content="https://securekeymaster.com/images/buyantivirus-twitter.jpg" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="SecureKeyMaster" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://securekeymaster.com/buyantivirus" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
      </Head>

      <main className="flex min-h-screen flex-col">
        <HeroSection />
        <ProductSection />
        <BenefitsSection />
        <TestimonialsSection />
        <TrustSection />
        <FaqSection />
        <Footer />
      </main>
    </>
  );
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps(context: any) {
  // You can fetch data here if needed
  return {
    props: {}, // will be passed to the page component as props
  };
}
