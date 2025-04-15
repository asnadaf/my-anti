import Head from 'next/head';
import HeroSection from "./buyantivirus/components/HeroSection";
import FeaturesSection from "./buyantivirus/components/FeaturesSection";
import TestimonialsSection from "./buyantivirus/components/TestimonialsSection";
import ProductSection from "./buyantivirus/components/ProductSection";
import BenefitsSection from "./buyantivirus/components/BenefitsSection";
import TrustSection from "./buyantivirus/components/TrustSection";
import FaqSection from "./buyantivirus/components/FaqSection";
import Footer from "@components/Footer";
import { fetchProducts } from '../lib/products';

export default function Home() {
  // Structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SecureKeyMaster - Premium Antivirus Solutions",
    "url": "https://securekeymaster.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://securekeymaster.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Premium Antivirus Solutions",
    "description": "Industry-leading antivirus protection for all your devices. Stay protected from malware, ransomware, and cyber threats.",
    "brand": {
      "@type": "Brand",
      "name": "SecureKeyMaster"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "29.99",
      "highPrice": "89.99",
      "offerCount": "6"
    }
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>SecureKeyMaster - Premium Antivirus Solutions | Protect Your Digital Life</title>
        <meta name="title" content="SecureKeyMaster - Premium Antivirus Solutions | Protect Your Digital Life" />
        <meta name="description" content="Get industry-leading antivirus protection for all your devices. Real-time threat detection, multi-device security, and 24/7 expert support. Protect against malware, ransomware, and cyber threats." />
        <meta name="keywords" content="antivirus, cybersecurity, malware protection, ransomware protection, internet security, computer security, virus protection, digital security, online protection, secure browsing" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://securekeymaster.com/" />
        <meta property="og:title" content="SecureKeyMaster - Premium Antivirus Solutions" />
        <meta property="og:description" content="Protect your digital life with industry-leading antivirus solutions. Real-time protection, multi-device security, and 24/7 expert support." />
        <meta property="og:image" content="https://securekeymaster.com/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://securekeymaster.com/" />
        <meta property="twitter:title" content="SecureKeyMaster - Premium Antivirus Solutions" />
        <meta property="twitter:description" content="Protect your digital life with industry-leading antivirus solutions. Real-time protection, multi-device security, and 24/7 expert support." />
        <meta property="twitter:image" content="https://securekeymaster.com/images/twitter-image.jpg" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="SecureKeyMaster" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://securekeymaster.com/" />

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
export async function getServerSideProps(context) {
  try {
    // Fetch data from your API or database
    const products = await fetchProducts();
    
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        products: [],
      },
    };
  }
}