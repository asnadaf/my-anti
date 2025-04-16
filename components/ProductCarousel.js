import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = ({ title, products = [] }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/buyantivirus/products/${product.slug}`}
            className="w-64 flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-40">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${product.discountPrice || product.originalPrice}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {product.duration?.devices} Devices • {product.duration?.period}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel; 