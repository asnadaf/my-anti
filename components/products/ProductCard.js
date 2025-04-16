import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  // If no product is provided, return a placeholder
  if (!product) {
    return (
      <div className="border rounded-lg shadow-sm bg-white flex flex-col h-full animate-pulse">
        {/* Image Placeholder */}
        <div className="bg-gray-300 w-full h-36 rounded-t-lg"></div>
        <div className="p-3">
          {/* Title */}
          <div className="bg-gray-300 h-5 w-3/4 rounded mb-2"></div>
          {/* Brand & License */}
          <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
          {/* Price */}
          <div className="mt-auto pt-2 flex justify-between items-center">
            <div className="bg-gray-300 h-6 w-20 rounded"></div>
            <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg shadow-sm bg-white flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Product Image - Always on top */}
      <div className="relative w-full h-36 bg-gray-50 rounded-t-lg">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        {product.tag && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1 flex flex-col p-3">
        {/* Product Title */}
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        
        {/* Brand & License Info */}
        <div className="flex flex-wrap items-center my-1">
          <span className="text-xs text-gray-500 mr-2">{product.category?.name || 'Antivirus'}</span>
          <span className="text-xs text-gray-500">
            {product.devices} {product.devices === 1 ? 'Device' : 'Devices'} • {product.duration}
          </span>
        </div>
        
        {/* Price and CTA Section */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-end">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs mr-1.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base font-bold text-blue-600">
              ${product.discountPrice?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <Link href={`/buyantivirus/products/${product.slug}`} passHref>
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 