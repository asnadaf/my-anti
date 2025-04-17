import Head from 'next/head';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchTopProduct, fetchFilteredProducts } from '@lib/products';
import FilterBar from '../../components/FilterBar';
import ProductGrid from '../../components/products/ProductGrid';
import SortBar from '../../components/products/SortBar';
import ProductCarousel from './components/ProductCarousel';
import ProductCard from '../../components/products/ProductCard';
import ProductDetailsModal from '../../components/ProductDetailsModal';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function BuyAntivirusPage({ 
  topProduct, 
  initialProducts = [], 
  totalCount = 0, 
  totalPages = 1, 
  currentPage = 1, 
  pageSize = 12, 
  usingFallback = false,
  initialError = null
}) {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [sortOption, setSortOption] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts || []);
  const [productCount, setProductCount] = useState(totalCount || 0);
  const [debugMode, setDebugMode] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [currentQuery, setCurrentQuery] = useState({});
  const [errorMessage, setErrorMessage] = useState(initialError || "");
  const [paginationState, setPaginationState] = useState({
    totalPages,
    currentPage,
    pageSize
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Initialize products with server-side data
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setProductCount(totalCount);
      setPaginationState({
        totalPages,
        currentPage,
        pageSize
      });
    }
  }, [initialProducts, totalCount, totalPages, currentPage, pageSize]);

  // Check if query params have changed significantly
  const haveQueriesChanged = useCallback((oldQuery, newQuery) => {
    const relevantParams = ['security', 'brand', 'duration', 'minPrice', 'maxPrice', 'page'];
    
    for (const param of relevantParams) {
      if (oldQuery[param] !== newQuery[param]) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Handle pagination change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > paginationState.totalPages) return;
    
    // Update URL to change page
    const queryParams = { ...router.query, page: newPage };
    router.push({
      pathname: router.pathname,
      query: queryParams,
    }, undefined, { shallow: true });
  }, [router, paginationState.totalPages]);

  // Get page numbers to display
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxPageButtons = 5; // Max number of page buttons to show
    const { totalPages, currentPage } = paginationState;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are fewer than maxPageButtons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page, last page, current page, and 1 page before/after current
      pages.push(1); // First page
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) {
        pages.push('...'); // Ellipsis if there's a gap
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push('...'); // Ellipsis if there's a gap
      }
      
      pages.push(totalPages); // Last page
    }
    
    return pages;
  }, [paginationState]);

  // Fetch products function
  const fetchProducts = useCallback(async (params, sortOpt) => {
    setIsLoading(true);
    setErrorMessage(""); // Clear any existing errors
    
    try {
      // Extract filter parameters from URL
      const { security, brand, duration, minPrice, maxPrice, page = '1' } = params;
      
      // Update current page state
      const pageNum = parseInt(page, 10) || 1;
      setPaginationState(prev => ({
        ...prev,
        currentPage: pageNum
      }));
      
      // Check if we're in the browser
      const isClient = typeof window !== 'undefined';
      
      let result;
      if (isClient) {
        // In browser, use the API route instead of direct DB access
        const queryParams = new URLSearchParams();
        if (security) queryParams.append('security', security);
        if (brand) queryParams.append('brand', brand);
        if (duration) queryParams.append('duration', duration);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sortOpt) queryParams.append('sortBy', sortOpt);
        queryParams.append('page', pageNum);
        
        // Call the API endpoint
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        result = await response.json();
      } else {
        // On server, use direct DB access
        result = await fetchFilteredProducts({
          security: security || undefined,
          brand: brand || undefined,
          duration: duration || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy: sortOpt,
          page: pageNum,
        });
      }
      
      // Check if the result contains an error
      if (result.error) {
        console.error('API returned error:', result.error);
        setErrorMessage(`Database error: ${result.error}`);
        setProducts([]);
        setUseFallback(true);
        return;
      }
      
      if (result && typeof result === 'object') {
        const { products: filteredProducts, totalCount, totalPages: pages, pageSize: limit } = result;
        if (Array.isArray(filteredProducts) && filteredProducts.length > 0) {
          setProducts(filteredProducts);
          setUseFallback(false);
          setPaginationState({
            totalPages: pages || Math.ceil(totalCount / (limit || 12)),
            currentPage: pageNum,
            pageSize: limit || 12
          });
        } else {
          setProducts([]);
          setUseFallback(true);
          setPaginationState({
            totalPages: 1,
            currentPage: 1,
            pageSize: 12
          });
        }
        if (typeof totalCount === 'number') {
          setProductCount(totalCount > 0 ? totalCount : 0);
        }
      } else {
        setProducts([]);
        setProductCount(0);
        setUseFallback(true);
        setPaginationState({
          totalPages: 1,
          currentPage: 1,
          pageSize: 12
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage(`Failed to fetch products: ${error.message}`);
      setProducts([]);
      setProductCount(0);
      setUseFallback(true);
      setPaginationState({
        totalPages: 1,
        currentPage: 1,
        pageSize: 12
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    fetchProducts(router.query, sortOption);
    
  }, [router.query, router.isReady, haveQueriesChanged, fetchProducts, sortOption, currentQuery]);

  // Handle sort change - this immediately changes products 
  const handleSortChange = useCallback((option) => {
    if (option === sortOption) return;
    
    setSortOption(option);
    fetchProducts(router.query, option);
    
  }, [fetchProducts, router.query, sortOption]);

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
  }, []);

  // Toggle mobile filter visibility
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);

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

  // Filter products for carousels
  const hotDeals = products?.filter(product => product.discount > 30) || [];
  const recommendedProducts = products?.filter(product => product.rating && product.rating >= 4.5) || [];
  const topProducts = products?.filter(product => product.popular) || [];

  // Handle product click
  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }, []);

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
              onClick={toggleDebugMode} 
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
              <p>Current Page: {paginationState.currentPage} of {paginationState.totalPages}</p>
              <p>Page Size: {paginationState.pageSize}</p>
              <p>Query Params: {JSON.stringify(router.query)}</p>
              <h4 className="font-bold mt-2 mb-1">First Product (if any):</h4>
              <pre>{products && products.length > 0 ? JSON.stringify(products[0], null, 2) : 'No products'}</pre>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span>{errorMessage}</span>
              </div>
              <div className="mt-2 text-xs">
                Using fallback product data. Please try again later or contact support if the issue persists.
              </div>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Antivirus Software</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-3xl">
              Find the best antivirus protection for your devices. Browse our selection of premium security solutions from top brands.
            </p>
          </div>

          {/* Hot Deals Carousel */}
          <ProductCarousel
            title="Hot Deals"
            products={hotDeals}
            tag="Limited Time"
            tagColor="bg-red-600"
          />

          {/* Recommended Products Carousel */}
          <ProductCarousel
            title="Recommended For You"
            products={recommendedProducts}
            tag="Top Rated"
            tagColor="bg-green-600"
          />

          {/* Top Products Carousel */}
          <ProductCarousel
            title="Top Products"
            products={topProducts}
            tag="Popular"
            tagColor="bg-blue-600"
          />
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-2">
            <button
              onClick={toggleMobileFilter}
              className="w-full flex items-center justify-center bg-white p-2 rounded-lg shadow-sm text-gray-700 text-xs"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="relative flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Filters Sidebar - Hidden on mobile unless toggled */}
            <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/5 h-fit bg-white`}>
              <div className="sticky top-0 pt-2">
                <FilterBar />
              </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id || product._id} 
                      className="h-[100px] sm:h-auto cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pagination Section */}
              <div className="mt-4 md:mt-6 flex flex-col items-center">
                {/* Product count info */}
                <div className="text-sm text-gray-600 mb-3">
                  Showing {products.length} of {productCount} products 
                  {paginationState.currentPage > 1 ? ` - Page ${paginationState.currentPage} of ${paginationState.totalPages}` : ''}
                </div>
                
                {/* Pagination controls */}
                {paginationState.totalPages > 1 && (
                  <nav className="inline-flex rounded-md shadow text-xs">
                    <button 
                      onClick={() => handlePageChange(paginationState.currentPage - 1)}
                      disabled={paginationState.currentPage === 1}
                      className={`py-1 px-2 md:py-1.5 md:px-3 border rounded-l-md ${
                        paginationState.currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      Prev
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      page === '...' 
                        ? (
                          <span 
                            key={`ellipsis-${index}`} 
                            className="py-1 px-2 md:py-1.5 md:px-3 bg-white border border-gray-300 text-gray-400"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`py-1 px-2 md:py-1.5 md:px-3 border ${
                              paginationState.currentPage === page
                                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                    ))}
                    
                    <button 
                      onClick={() => handlePageChange(paginationState.currentPage + 1)}
                      disabled={paginationState.currentPage === paginationState.totalPages}
                      className={`py-1 px-2 md:py-1.5 md:px-3 border rounded-r-md ${
                        paginationState.currentPage === paginationState.totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </>
  );
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps(context) {
  try {
    const { query } = context;
    
    const page = query.page ? parseInt(query.page) : 1;
    const pageSize = 12;
    const sort = query.sort || 'relevance';
    
    // Try to fetch data from API
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('pageSize', pageSize);
      queryParams.append('sort', sort);
      
      if (query.category) queryParams.append('category', query.category);
      if (query.priceRange) queryParams.append('priceRange', query.priceRange);
      if (query.brand) queryParams.append('brand', query.brand);
      if (query.search) queryParams.append('search', query.search);
      
      // Fetch data from API
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = context.req.headers.host;
      const url = `${protocol}://${host}/api/products?${queryParams.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        console.error('API returned error:', data.error);
        throw new Error(data.error);
      }
      
      return {
        props: {
          initialProducts: data.products || [],
          topProduct: data.topProduct || null,
          totalCount: data.totalCount || 0,
          totalPages: data.totalPages || 1,
          currentPage: page || 1,
          pageSize,
          usingFallback: false,
          initialError: null
        }
      };
    } catch (error) {
      console.error('Error fetching data:', error.message);
      return { 
        props: {
          initialProducts: [],
          topProduct: null,
          totalCount: 0,
          totalPages: 1,
          currentPage: 1,
          pageSize,
          usingFallback: false,
          initialError: `Failed to fetch products: ${error.message}`
        }
      };
    }
  } catch (error) {
    console.error('Server error:', error);
    return { 
      props: {
        initialProducts: [],
        topProduct: null,
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 12,
        usingFallback: false,
        initialError: `Server error: ${error.message}`
      }
    };
  }
}
