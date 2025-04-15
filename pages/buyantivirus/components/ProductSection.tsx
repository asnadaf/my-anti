import React from 'react';
import { Button } from "../../../components/ui/button";
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { fetchFeaturedProducts } from '../../../lib/products';

interface Product {
  id: string;
  name: string;
  brand: string;
  discountPrice: number;
  originalPrice: number;
  devices: number;
  duration: string;
  features: string[];
  isMostPopular?: boolean;
  slug?: string;
  image?: string;
}

interface ProductSectionProps {
  products?: Product[];
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const defaultProducts: Product[] = [
  {
    id: "norton-360-deluxe",
    name: "Norton 360 Deluxe",
    brand: "Norton",
    discountPrice: 29.99,
    originalPrice: 79.99,
    devices: 5,
    duration: "1 Year",
    features: ["Real-Time Threat Protection", "Secure VPN", "Password Manager", "Cloud Backup", "Dark Web Monitoring"],
    isMostPopular: true,
    slug: "norton-360-deluxe",
    image: "/images/products/norton-360-deluxe.jpg"
  },
  {
    id: "mcafee-total-protection",
    name: "McAfee Total Protection",
    brand: "McAfee",
    discountPrice: 34.99,
    originalPrice: 89.99,
    devices: 5,
    duration: "1 Year",
    features: ["Antivirus Protection", "Performance Optimization", "Home Network Security", "Password Manager", "Safe Web Browsing"],
    slug: "mcafee-total-protection",
    image: "/images/products/mcafee-total-protection.jpg"
  },
  {
    id: "bitdefender-total-security",
    name: "Bitdefender Total Security",
    brand: "Bitdefender",
    discountPrice: 39.99,
    originalPrice: 94.99,
    devices: 5,
    duration: "1 Year",
    features: ["Multi-Layer Ransomware Protection", "Network Threat Prevention", "Microphone Monitor", "Anti-Theft Tools", "Privacy Firewall"],
    slug: "bitdefender-total-security",
    image: "/images/products/bitdefender-total-security.jpg"
  },
  {
    id: "kaspersky-internet-security",
    name: "Kaspersky Internet Security",
    brand: "Kaspersky",
    discountPrice: 24.99,
    originalPrice: 69.99,
    devices: 3,
    duration: "1 Year",
    features: ["Anti-Phishing Protection", "Safe Money Mode", "VPN Connection", "Anti-Banner", "Webcam Protection"],
    slug: "kaspersky-internet-security",
    image: "/images/products/kaspersky-internet-security.jpg"
  }
];

// Helper function to map database products to the expected format
const mapDatabaseProducts = (dbProducts: any[]): Product[] => {
  if (!dbProducts || dbProducts.length === 0) return [];
  
  return dbProducts.map((product, index) => ({
    id: product._id || `product-${index}`,
    name: product.name || '',
    brand: product.brand || product.name?.split(' ')[0] || 'Unknown',
    discountPrice: product.discountPrice || product.originalPrice || 0,
    originalPrice: product.originalPrice || 0,
    devices: product.devices || 5, // Default to 5 devices
    duration: product.duration?.name || '1 Year', // Default to 1 Year
    features: product.features || [],
    isMostPopular: product.tag === 'Top' || index === 0,
    slug: product.slug || '',
    image: product.image || '/images/products/default.jpg'
  }));
};

const ProductSection: React.FC<ProductSectionProps> = ({ 
  products = defaultProducts,
  title = "Featured Antivirus Solutions",
  description = "Protect your devices with industry-leading antivirus software. All our keys are 100% genuine, with instant delivery and full support.",
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : ''
}) => {
  // Generate structured data for products
  const generateStructuredData = () => {
    if (!products || products.length === 0) {
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
      };
    }

    const productList = products.map(product => ({
      "@type": "Product",
      "name": product.name,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "offers": {
        "@type": "Offer",
        "price": product.discountPrice,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `${canonicalUrl}/${product.slug}`
      },
      "description": product.features.join(", "),
      "image": product.image
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": productList.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": product
      }))
    };
  };

  return (
    <>
      <Head>
        <title>{title} | Antivirus Solutions</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        <link rel="canonical" href={canonicalUrl} />
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }} 
        />
      </Head>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
                  {product.isMostPopular && (
                    <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-white text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">{product.name}</h2>
                      <p className="text-gray-500 dark:text-gray-400">{product.brand}</p>
                    </div>
                    <div className="mb-6 flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.discountPrice.toFixed(2)}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round((1 - product.discountPrice / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center">
                        <Shield size={16} className="mr-1 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{product.devices} Devices</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{product.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Zap size={16} className="mr-2 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No products available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center">
              View All Products <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

// Server-side rendering function
export const getServerSideProps: GetServerSideProps<ProductSectionProps> = async (context) => {
  try {
    // Fetch products from the database
    const dbProducts = await fetchFeaturedProducts();
    
    // Map database products to the expected format
    const productsToUse = mapDatabaseProducts(dbProducts);
    
    // If no products found, use default products
    const finalProducts = productsToUse.length > 0 ? productsToUse : defaultProducts;
    
    // Get the canonical URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host;
    const canonicalUrl = `${protocol}://${host}${context.resolvedUrl}`;
    
    return {
      props: {
        products: finalProducts,
        title: "Featured Antivirus Solutions",
        description: "Protect your devices with industry-leading antivirus software. All our keys are 100% genuine, with instant delivery and full support.",
        canonicalUrl
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Fallback to default products in case of error
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host;
    const canonicalUrl = `${protocol}://${host}${context.resolvedUrl}`;
    
    return {
      props: {
        products: defaultProducts,
        title: "Featured Antivirus Solutions",
        description: "Protect your devices with industry-leading antivirus software. All our keys are 100% genuine, with instant delivery and full support.",
        canonicalUrl
      }
    };
  }
};

export default ProductSection; 