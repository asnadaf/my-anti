import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { fetchProducts, fetchTopSellingProducts } from '../lib/products';
import { ShoppingCart, Award, Clock, Shield, Zap, Check, Tag } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import Footer from "@components/Footer";

export default function Home({ topSellingProducts = [], multiUserProducts = [], featuredProducts = [] }) {
  // Structured data for better SEO
  const websiteStructuredData = {
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

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SecureKeyMaster",
    "url": "https://securekeymaster.com",
    "logo": "https://securekeymaster.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://facebook.com/securekeymaster",
      "https://twitter.com/securekeymaster",
      "https://instagram.com/securekeymaster"
    ]
  };

  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": topSellingProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
    "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": `${product.name} - ${product.brand} antivirus protection for ${product.duration?.period || '1 Year'}`,
    "brand": {
      "@type": "Brand",
          "name": product.brand
    },
    "offers": {
          "@type": "Offer",
          "price": product.discountPrice,
      "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": `https://securekeymaster.com/buyantivirus/products/${product.slug}`
        }
      }
    }))
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are your antivirus license keys genuine?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our license keys are 100% genuine and sourced directly from authorized distributors. We provide a guarantee of successful activation with every purchase."
        }
      },
      {
        "@type": "Question",
        "name": "How quickly will I receive my license key?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide instant delivery of license keys. You'll receive your key immediately after purchase via email and can access it in your account dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept all major credit cards, PayPal, and various other secure payment methods. All transactions are encrypted and secure."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>SecureKeyMaster - Premium Antivirus License Keys | Up to 80% Off</title>
        <meta name="title" content="SecureKeyMaster - Premium Antivirus License Keys | Up to 80% Off" />
        <meta name="description" content="Get genuine antivirus license keys at discounted prices. Norton, McAfee, Bitdefender, Kaspersky & more. Instant delivery, 24/7 support, and money-back guarantee." />
        <meta name="keywords" content="antivirus license keys, Norton, McAfee, Bitdefender, Kaspersky, antivirus software, digital security, cheap antivirus, discount antivirus, buy antivirus online" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://securekeymaster.com/" />
        <meta property="og:title" content="SecureKeyMaster - Premium Antivirus License Keys | Up to 80% Off" />
        <meta property="og:description" content="Get genuine antivirus license keys at discounted prices. Norton, McAfee, Bitdefender, Kaspersky & more. Instant delivery, 24/7 support, and money-back guarantee." />
        <meta property="og:image" content="https://securekeymaster.com/images/og-image.jpg" />
        <meta property="og:site_name" content="SecureKeyMaster" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://securekeymaster.com/" />
        <meta property="twitter:title" content="SecureKeyMaster - Premium Antivirus License Keys | Up to 80% Off" />
        <meta property="twitter:description" content="Get genuine antivirus license keys at discounted prices. Norton, McAfee, Bitdefender, Kaspersky & more. Instant delivery, 24/7 support, and money-back guarantee." />
        <meta property="twitter:image" content="https://securekeymaster.com/images/twitter-image.jpg" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </Head>

      <main className="flex min-h-screen flex-col">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Premium Antivirus License Keys at Unbeatable Prices</h1>
                <p className="text-xl mb-6 text-blue-100">Get up to 80% off on genuine Norton, McAfee, Bitdefender, Kaspersky & more. Instant delivery and 24/7 support.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/buyantivirus/products">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">Shop Now</Button>
                  </Link>
                  <Link href="/buyantivirus/contact">
                    <Button variant="outline" className="border-white text-white hover:bg-blue-700">Contact Support</Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-[300px]">
                  <Image 
                    src="/images/hero-image.png" 
                    alt="Antivirus Protection" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Boxes */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Award className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">100% Genuine</h3>
                  <p className="text-sm text-gray-600">Authorized reseller</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Clock className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Delivery</h3>
                  <p className="text-sm text-gray-600">No waiting time</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Tag className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Up to 80% Off</h3>
                  <p className="text-sm text-gray-600">Lowest price guarantee</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Shield className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg overflow-hidden relative">
                <div className="z-10 relative">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">TOP SELLING PRODUCTS</h3>
                  <p className="mb-4">Trusted by thousands of customers worldwide</p>
                  <Link href="/buyantivirus/products?sort=bestseller">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">Shop Now</Button>
                  </Link>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20">
                  <ShoppingCart size={120} />
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg overflow-hidden relative">
                <div className="z-10 relative">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">SAVE BIG - UP TO 80% OFF</h3>
                  <p className="mb-4">Limited time offer on all antivirus products</p>
                  <Link href="/buyantivirus/products?sort=discount">
                    <Button className="bg-white text-red-600 hover:bg-red-50">Shop Now</Button>
                  </Link>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20">
                  <Tag size={120} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hot Selling Products */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Hot Selling Products</h2>
              <Link href="/buyantivirus/products" className="text-blue-600 hover:underline flex items-center">
                View All <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topSellingProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Antivirus", path: "/buyantivirus/products?category=antivirus" },
                { name: "Total Protection", path: "/buyantivirus/products?category=total-protection" },
                { name: "Internet Security", path: "/buyantivirus/products?category=internet-security" },
                { name: "Mobile Security", path: "/buyantivirus/products?category=mobile" }
              ].map((category) => (
                <Link href={category.path} key={category.name} className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <div className="mb-4 flex justify-center">
                      <Shield className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <h3 className="text-center font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Multi Users */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Multi-User Deals</h2>
              <Link href="/buyantivirus/products?users=multi" className="text-blue-600 hover:underline flex items-center">
                View All <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {multiUserProducts.slice(0, 6).map((product) => (
                <div key={product.id || product._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4">
                    <span className="text-xs text-gray-500 block mb-1">{product.devices || 10}PC / {product.duration?.period || "1 Year"}</span>
                    <h3 className="font-bold text-sm line-clamp-2 h-10">{product.name}</h3>
                    <div className="mt-3 flex flex-col">
                      <span className="text-base font-bold text-blue-600">
                        ₹{product.discountPrice?.toFixed(2) || '0.00'}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Brands */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Brands</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {['Norton', 'McAfee', 'Bitdefender', 'Kaspersky', 'ESET', 'AVG'].map((brand) => (
                <Link href={`/buyantivirus/products?brand=${brand.toLowerCase()}`} key={brand} className="group">
                  <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-all flex flex-col items-center">
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                      <Image 
                        src={`/images/brands/${brand.toLowerCase()}.png`}
                        alt={brand}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-center font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{brand}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {featuredProducts.slice(0, 10).map((product) => (
                <div key={product.id || product._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4">
                    <span className="text-xs text-gray-500 block mb-1">{product.duration?.devices || 1}PC / {product.duration?.period || "1 Year"}</span>
                    <h3 className="font-bold text-sm line-clamp-2 h-10">{product.name}</h3>
                    <div className="mt-3">
                      <span className="text-base font-bold text-blue-600 block">
                        ₹{product.discountPrice?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose SecureKeyMaster</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Award className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Genuine Products</h3>
                <p className="text-gray-600">All our license keys are 100% genuine and sourced directly from authorized distributors. We guarantee successful activation.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Tag className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Lowest Price Guarantee</h3>
                <p className="text-gray-600">We offer the best prices on the market. Found a better price elsewhere? We'll match it and give you an extra 5% off.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Support</h3>
                <p className="text-gray-600">Our dedicated support team is available 24/7 to assist you with any queries or concerns about your purchase.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200">
                <summary className="font-semibold cursor-pointer">Are your antivirus license keys genuine?</summary>
                <p className="mt-2 text-gray-600 pl-4">Yes, all our license keys are 100% genuine and sourced directly from authorized distributors. We provide a guarantee of successful activation with every purchase.</p>
              </details>
              <details className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200">
                <summary className="font-semibold cursor-pointer">How quickly will I receive my license key?</summary>
                <p className="mt-2 text-gray-600 pl-4">We provide instant delivery of license keys. You'll receive your key immediately after purchase via email and can access it in your account dashboard.</p>
              </details>
              <details className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200">
                <summary className="font-semibold cursor-pointer">What payment methods do you accept?</summary>
                <p className="mt-2 text-gray-600 pl-4">We accept all major credit cards, PayPal, and various other secure payment methods. All transactions are encrypted and secure.</p>
              </details>
              <details className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200">
                <summary className="font-semibold cursor-pointer">What if I have trouble activating my license key?</summary>
                <p className="mt-2 text-gray-600 pl-4">Our 24/7 customer support team is always ready to help. Contact us via email, phone, or live chat and we'll resolve the issue promptly.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign up to Newsletter</h2>
              <p className="text-gray-600 mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps(context) {
  try {
    // Fetch top selling products and multi-user products
    const [topSellingProducts, multiUserData, featuredData] = await Promise.all([
      fetchTopSellingProducts(8),
      fetchProducts({ minDevices: 5, limit: 6 }),
      fetchProducts({ featured: true, limit: 10 })
    ]);
    
    return {
      props: {
        topSellingProducts: topSellingProducts || [],
        multiUserProducts: multiUserData?.products || [],
        featuredProducts: featuredData?.products || []
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        topSellingProducts: [],
        multiUserProducts: [],
        featuredProducts: []
      },
    };
  }
}