import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchTopProduct, fetchFilteredProducts } from '@lib/products';
import FilterBar from '../../components/FilterBar';
import ProductGrid from '../../components/products/ProductGrid';
import SortBar from '../../components/products/SortBar';

interface Product {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  category: {
    name: string;
    _id: string;
  };
  securityFeature: string;
  brand: string;
  features: string[];
  image: string;
  tag: string;
  duration: {
    name: string;
    devices: number;
    period: string;
    _id: string;
  };
  slug: string;
}

interface BuyAntivirusPageProps {
  topProduct: Product | null;
  initialProducts: Product[];
  totalCount: number;
}

export default function BuyAntivirusPage({ topProduct, initialProducts, totalCount }: BuyAntivirusPageProps) {
  const router = useRouter();
  const [sortOption, setSortOption] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productCount, setProductCount] = useState(totalCount);

  // When sort option or URL query params change, fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!router.isReady) return;
      
      setIsLoading(true);
      try {
        // Extract filter parameters from URL
        const { security, brand, duration, minPrice, maxPrice, page = '1' } = router.query;
        
        // Call API to get filtered products
        const { products: filteredProducts, totalCount } = await fetchFilteredProducts({
          security: security as string,
          brand: brand as string,
          duration: duration as string,
          minPrice: minPrice as string,
          maxPrice: maxPrice as string,
          sortBy: sortOption,
          page: parseInt(page as string),
        });
        
        setProducts(filteredProducts);
        setProductCount(totalCount);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [router.query, sortOption, router.isReady]);

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

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
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "price": product.discountPrice.toString(),
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": `https://securekeymaster.com/buyantivirus/products/${product.slug}`
        }
      }
    }))
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

      <main className="bg-gray-50 min-h-screen py-3 px-2 sm:py-4 sm:px-3 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header - More compact */}
          <div className="mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Antivirus Software</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-3xl">
              Find the best antivirus protection for your devices. Browse our selection of premium security solutions from top brands.
            </p>
          </div>
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full flex items-center justify-center bg-white p-2 rounded-lg shadow-sm text-gray-700 text-xs"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Filters Sidebar - Hidden on mobile unless toggled */}
            <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/5 sticky top-16 self-start mb-3 lg:mb-0`}>
              <FilterBar />
            </div>
            
            {/* Main Content - Wider on desktop for 4 items per row */}
            <div className="lg:w-4/5">
              {/* Sort Bar */}
              <SortBar 
                totalProducts={productCount} 
                sortOption={sortOption} 
                onSortChange={handleSortChange} 
              />
              
              {/* Products Grid */}
              <ProductGrid 
                products={products} 
                isLoading={isLoading} 
              />
              
              {/* Pagination - More compact */}
              <div className="mt-4 md:mt-6 flex justify-center">
                <nav className="inline-flex rounded-md shadow text-xs">
                  <a href="#" className="py-1 px-2 md:py-1.5 md:px-3 bg-white border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50">
                    Prev
                  </a>
                  <a href="#" className="py-1 px-2 md:py-1.5 md:px-3 bg-blue-600 border border-blue-600 text-white hover:bg-blue-700">
                    1
                  </a>
                  <a href="#" className="py-1 px-2 md:py-1.5 md:px-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    2
                  </a>
                  <a href="#" className="py-1 px-2 md:py-1.5 md:px-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                    3
                  </a>
                  <a href="#" className="py-1 px-2 md:py-1.5 md:px-3 bg-white border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50">
                    Next
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps(context) {
  const { query } = context;
  const { 
    security, 
    brand, 
    duration, 
    minPrice, 
    maxPrice, 
    page = '1' 
  } = query;

  try {
    // Get initial data based on any filter params in the URL
    const [topProduct, { products, totalCount }] = await Promise.all([
      fetchTopProduct(),
      fetchFilteredProducts({
        security,
        brand,
        duration,
        minPrice,
        maxPrice,
        sortBy: 'relevance',
        page: parseInt(page),
      })
    ]);

    return {
      props: {
        topProduct,
        initialProducts: products,
        totalCount,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        topProduct: null,
        initialProducts: [],
        totalCount: 0,
      },
    };
  }
}
