import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isLoading = false }) => {
  // Generate placeholder products while loading
  const placeholderProducts = isLoading 
    ? Array(8).fill(null)
    : null;
    
  const displayProducts = isLoading ? placeholderProducts : products;
  
  console.log('ProductGrid received:', { 
    productsLength: products?.length || 0, 
    isLoading, 
    displayProductsLength: displayProducts?.length || 0 
  });
  
  if (!isLoading && (!displayProducts || displayProducts.length === 0)) {
    return (
      <div className="w-full bg-white rounded-lg p-6 text-center shadow-sm">
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {displayProducts.map((product, index) => (
        <div key={product?._id || `placeholder-${index}`} className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid; 