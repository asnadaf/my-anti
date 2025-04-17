import React from 'react';
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "../../components/ui/button";
import { Shield, Users, Award, Globe, ThumbsUp, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SecureKeyMaster - Leading Antivirus License Provider Since 2015',
  description: 'Discover why SecureKeyMaster is the trusted choice for genuine antivirus license keys. Serving 50,000+ customers with instant delivery, 24/7 support, and the best prices on Norton, McAfee, and Bitdefender licenses.',
  keywords: 'antivirus license, security software, digital protection, genuine keys, Norton license, McAfee license, Bitdefender license, antivirus deals, cybersecurity',
  openGraph: {
    title: 'About SecureKeyMaster - Your Trusted Antivirus License Provider',
    description: 'Leading provider of genuine antivirus license keys with 24/7 support and instant delivery. Trusted by 50,000+ customers worldwide.',
    type: 'website',
    url: 'https://securekeymaster.com/about',
    images: [
      {
        url: 'https://securekeymaster.com/images/about-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SecureKeyMaster - About Us'
      }
    ],
    siteName: 'SecureKeyMaster',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SecureKeyMaster - Your Trusted Antivirus License Provider',
    description: 'Leading provider of genuine antivirus license keys with 24/7 support and instant delivery.',
    images: ['https://securekeymaster.com/images/about-twitter.jpg']
  },
  alternates: {
    canonical: 'https://securekeymaster.com/about'
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
    other: {
      me: ['your-email@example.com']
    }
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About SecureKeyMaster",
  "description": "Leading provider of genuine antivirus license keys with 24/7 support and instant delivery",
  "url": "https://securekeymaster.com/about",
  "publisher": {
    "@type": "Organization",
    "name": "SecureKeyMaster",
    "logo": {
      "@type": "ImageObject",
      "url": "https://securekeymaster.com/images/logo.png"
    }
  },
  "mainEntity": {
    "@type": "Organization",
    "name": "SecureKeyMaster",
    "description": "Leading provider of genuine antivirus license keys",
    "foundingDate": "2015",
    "numberOfEmployees": "50",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@securekeymaster.com",
      "availableLanguage": ["English", "Spanish", "French"]
    }
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen flex flex-col bg-background">
        {/* <Header /> */}
        <main className="flex-grow">
          <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About SecureKeyMaster</h1>
                <p className="text-xl text-blue-100">
                  Your trusted partner in digital security since 2015. We provide genuine antivirus license keys at the best prices with exceptional customer service.
                </p>
              </div>
            </div>
          </section>
          
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <p className="text-gray-600">Customer Support</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <p className="text-gray-600">Genuine Products</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Shield className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Genuine Products</h3>
                  <p className="text-gray-600">All our license keys are 100% genuine and sourced directly from authorized distributors.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Clock className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Instant Delivery</h3>
                  <p className="text-gray-600">Get your license key immediately after purchase with our automated delivery system.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                  <p className="text-gray-600">Our dedicated support team is always ready to help you with any questions or concerns.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Devices?</h2>
              <p className="text-xl mb-8">Join thousands of satisfied customers who trust SecureKeyMaster for their antivirus needs.</p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Shop Now
              </Button>
            </div>
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
} 