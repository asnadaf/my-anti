import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { fetchTopProduct, fetchFilteredProducts } from '@lib/products';
import FilterBar from '../../components/FilterBar';
import ProductGrid from '../../components/products/ProductGrid';
import SortBar from '../../components/products/SortBar';

export default function BuyAntivirusPage({ topProduct, initialProducts, totalCount, usingFallback = false }) {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [sortOption, setSortOption] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts || []);
  const [productCount, setProductCount] = useState(totalCount || 0);
  const [debugMode, setDebugMode] = useState(false);
  const [useFallback, setUseFallback] = useState(usingFallback);
  const [currentQuery, setCurrentQuery] = useState({});

  // Sample fallback products in case API fails
  const fallbackProducts = [
    {
      _id: 'fallback1',
      name: 'Norton 360 Deluxe',
      description: 'Complete protection for up to 5 devices with secure VPN.',
      originalPrice: 89.99,
      discountPrice: 39.99,
      category: { name: 'Antivirus', _id: 'cat1' },
      securityFeature: 'Total Protection',
      brand: 'NORTON',
      features: ['Real-time Protection', 'VPN', 'Password Manager'],
      image: 'https://example.com/norton.jpg',
      tag: 'Featured',
      duration: { name: '1 Year', devices: 5, period: '1 Year', _id: 'dur1' },
      slug: 'norton-360-deluxe'
    },
    {
      _id: 'fallback2',
      name: 'McAfee Total Protection',
      description: 'Advanced security for all your devices.',
      originalPrice: 99.99,
      discountPrice: 49.99,
      category: { name: 'Antivirus', _id: 'cat2' },
      securityFeature: 'Total Protection',
      brand: 'MCAFEE',
      features: ['Virus Scanner', 'Firewall', 'Identity Protection'],
      image: 'https://example.com/mcafee.jpg',
      tag: 'Popular',
      duration: { name: '1 Year', devices: 10, period: '1 Year', _id: 'dur2' },
      slug: 'mcafee-total-protection'
    },
    {
      _id: 'fallback3',
      name: 'Kaspersky Internet Security',
      description: 'Premium protection against cyber threats.',
      originalPrice: 79.99,
      discountPrice: 34.99,
      category: { name: 'Antivirus', _id: 'cat3' },
      securityFeature: 'Internet Security',
      brand: 'KASPERSKY',
      features: ['Safe Banking', 'Webcam Protection', 'VPN'],
      image: 'https://example.com/kaspersky.jpg',
      tag: 'Top',
      duration: { name: '1 Year', devices: 3, period: '1 Year', _id: 'dur3' },
      slug: 'kaspersky-internet-security'
    },
    {
      _id: 'fallback4',
      name: 'Bitdefender Total Security',
      description: 'Complete protection for Windows, Mac, iOS and Android.',
      originalPrice: 89.99,
      discountPrice: 44.99,
      category: { name: 'Antivirus', _id: 'cat4' },
      securityFeature: 'Total Security',
      brand: 'BITDEFENDER',
      features: ['Multi-layer Ransomware Protection', 'Microphone Monitor', 'Anti-tracker'],
      image: 'https://example.com/bitdefender.jpg',
      tag: 'Best Seller',
      duration: { name: '1 Year', devices: 5, period: '1 Year', _id: 'dur4' },
      slug: 'bitdefender-total-security'
    }
  ];

  // Check if query params have changed significantly
  const haveQueriesChanged = (oldQuery, newQuery) => {
    const relevantParams = ['security', 'brand', 'duration', 'minPrice', 'maxPrice', 'page'];
    
    for (const param of relevantParams) {
      if (oldQuery[param] !== newQuery[param]) {
        return true;
      }
    }
    
    return false;
  };

  // When router query changes, fetch products if needed
  useEffect(() => {
    if (!router.isReady) return;

    // Skip the first mount since we already have SSR data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setCurrentQuery(router.query);
      return;
    }
    
    // Only fetch if the relevant query params have changed
    if (!haveQueriesChanged(currentQuery, router.query)) {
      return;
    }
    
    setCurrentQuery(router.query);
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Extract filter parameters from URL
        const { security, brand, duration, minPrice, maxPrice, page = '1' } = router.query;
        
        // Call API to get filtered products
        const result = await fetchFilteredProducts({
          security: security || undefined,
          brand: brand || undefined,
          duration: duration || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy: sortOption,
          page: parseInt(page, 10) || 1,
        });
        
        console.log('Client fetch result:', result);
        
        if (result && typeof result === 'object') {
          const { products: filteredProducts, totalCount } = result;
          if (Array.isArray(filteredProducts) && filteredProducts.length > 0) {
            setProducts(filteredProducts);
            setUseFallback(false);
            console.log('Setting products:', filteredProducts.length);
          } else {
            console.warn('No products returned from API, using fallback data');
            setProducts(fallbackProducts);
            setUseFallback(true);
          }
          if (typeof totalCount === 'number') {
            setProductCount(totalCount > 0 ? totalCount : fallbackProducts.length);
          }
        } else {
          console.warn('Invalid API response, using fallback data');
          setProducts(fallbackProducts);
          setProductCount(fallbackProducts.length);
          setUseFallback(true);
        }
      } catch (error) {
        console.error('Error fetching filtered products:', error);
        setProducts(fallbackProducts);
        setProductCount(fallbackProducts.length);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [router.query, router.isReady]);

  // Handle sort change - this immediately changes products 
  const handleSortChange = (option) => {
    if (option === sortOption) return;
    
    setSortOption(option);
    
    // Fetch with new sort option but keep other filters
    const fetchWithNewSort = async () => {
      setIsLoading(true);
      try {
        const { security, brand, duration, minPrice, maxPrice, page = '1' } = router.query;
        
        const result = await fetchFilteredProducts({
          security: security || undefined,
          brand: brand || undefined,
          duration: duration || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy: option, // Use the new sort option
          page: parseInt(page, 10) || 1,
        });
        
        if (result && typeof result === 'object') {
          const { products: filteredProducts } = result;
          if (Array.isArray(filteredProducts) && filteredProducts.length > 0) {
            setProducts(filteredProducts);
            setUseFallback(false);
          }
        }
      } catch (error) {
        console.error('Error sorting products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWithNewSort();
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
        },
        "image": product.image
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
          {/* Debug Mode Toggle */}
          <div className="mb-2 flex justify-end">
            <button 
              onClick={() => setDebugMode(!debugMode)} 
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>

          {/* Debug Information */}
          {debugMode && (
            <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded text-xs font-mono overflow-auto max-h-60">
              <h3 className="font-bold mb-1">Debug Info:</h3>
              <p>Products Count: {products?.length || 0}</p>
              <p>Total Count: {productCount}</p>
              <p>Loading: {isLoading ? 'True' : 'False'}</p>
              <p>Sort Option: {sortOption}</p>
              <p>Using Fallback Data: {useFallback ? 'Yes' : 'No'}</p>
              <p>Query Params: {JSON.stringify(router.query)}</p>
              <h4 className="font-bold mt-2 mb-1">First Product (if any):</h4>
              <pre>{products && products.length > 0 ? JSON.stringify(products[0], null, 2) : 'No products'}</pre>
            </div>
          )}

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
              
              {/* Products Grid with Loading Overlay */}
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                    <div className="loader rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600 w-8 h-8 animate-spin"></div>
                  </div>
                )}
                <ProductGrid 
                  products={products} 
                  isLoading={false} // We're handling loading state differently now
                />
              </div>
              
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

  // Fallback products for SSR
  const fallbackProducts = [
    {
      _id: 'fallback1',
      name: 'Norton 360 Deluxe',
      description: 'Complete protection for up to 5 devices with secure VPN.',
      originalPrice: 89.99,
      discountPrice: 39.99,
      category: { name: 'Antivirus', _id: 'cat1' },
      securityFeature: 'Total Protection',
      brand: 'NORTON',
      features: ['Real-time Protection', 'VPN', 'Password Manager'],
      image: 'https://example.com/norton.jpg',
      tag: 'Featured',
      duration: { name: '1 Year', devices: 5, period: '1 Year', _id: 'dur1' },
      slug: 'norton-360-deluxe'
    },
    {
      _id: 'fallback2',
      name: 'McAfee Total Protection',
      description: 'Advanced security for all your devices.',
      originalPrice: 99.99,
      discountPrice: 49.99,
      category: { name: 'Antivirus', _id: 'cat2' },
      securityFeature: 'Total Protection',
      brand: 'MCAFEE',
      features: ['Virus Scanner', 'Firewall', 'Identity Protection'],
      image: 'https://example.com/mcafee.jpg',
      tag: 'Popular',
      duration: { name: '1 Year', devices: 10, period: '1 Year', _id: 'dur2' },
      slug: 'mcafee-total-protection'
    },
    {
      _id: 'fallback3',
      name: 'Kaspersky Internet Security',
      description: 'Premium protection against cyber threats.',
      originalPrice: 79.99,
      discountPrice: 34.99,
      category: { name: 'Antivirus', _id: 'cat3' },
      securityFeature: 'Internet Security',
      brand: 'KASPERSKY',
      features: ['Safe Banking', 'Webcam Protection', 'VPN'],
      image: 'https://example.com/kaspersky.jpg',
      tag: 'Top',
      duration: { name: '1 Year', devices: 3, period: '1 Year', _id: 'dur3' },
      slug: 'kaspersky-internet-security'
    },
    {
      _id: 'fallback4',
      name: 'Bitdefender Total Security',
      description: 'Complete protection for Windows, Mac, iOS and Android.',
      originalPrice: 89.99,
      discountPrice: 44.99,
      category: { name: 'Antivirus', _id: 'cat4' },
      securityFeature: 'Total Security',
      brand: 'BITDEFENDER',
      features: ['Multi-layer Ransomware Protection', 'Microphone Monitor', 'Anti-tracker'],
      image: 'https://example.com/bitdefender.jpg',
      tag: 'Best Seller',
      duration: { name: '1 Year', devices: 5, period: '1 Year', _id: 'dur4' },
      slug: 'bitdefender-total-security'
    }
  ];

  try {
    console.log('SSR: Starting to fetch products with query params:', query);

    // Always fetch all products on initial load if no filters are specified
    let apiFilters = {
      sortBy: 'relevance',
      page: parseInt(page, 10) || 1,
    };

    // Only add filter parameters that are actually present
    if (security) apiFilters.security = security;
    if (brand) apiFilters.brand = brand;
    if (duration) apiFilters.duration = duration;
    if (minPrice) apiFilters.minPrice = minPrice;
    if (maxPrice) apiFilters.maxPrice = maxPrice;

    // Get initial data based on any filter params in the URL
    const topProductPromise = fetchTopProduct();
    const productsPromise = fetchFilteredProducts(apiFilters);

    const [topProduct, productsResult] = await Promise.all([topProductPromise, productsPromise]);
    
    // Check if we got valid products from the API
    let products = [];
    let totalCount = 0;
    let usingFallback = false;
    
    if (productsResult && productsResult.products && Array.isArray(productsResult.products) && productsResult.products.length > 0) {
      // Use API data
      console.log('SSR: Using API data, found', productsResult.products.length, 'products');
      products = productsResult.products;
      totalCount = typeof productsResult.totalCount === 'number' ? productsResult.totalCount : productsResult.products.length;
    } else {
      // Use fallback data
      console.log('SSR: No products from API, using fallback data');
      products = fallbackProducts;
      totalCount = fallbackProducts.length;
      usingFallback = true;
    }
    
    return {
      props: {
        topProduct: topProduct || null,
        initialProducts: products,
        totalCount,
        usingFallback
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        topProduct: null,
        initialProducts: fallbackProducts,
        totalCount: fallbackProducts.length,
        usingFallback: true
      },
    };
  }
}
