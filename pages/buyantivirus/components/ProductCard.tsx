"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Star, Check } from 'lucide-react';

// Define the Product interface
interface Product {
  _id?: string;
  id?: string | number;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice: number;
  discount: number;
  devices: number;
  duration: string | { name: string; devices: number; period: string };
  features: string[];
  image: string;
  popular: boolean;
  slug?: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  sku?: string;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Safely extract duration info
  const deviceCount = typeof product.duration === 'object' 
    ? product.duration?.devices || 1 
    : 1;
  const durationPeriod = typeof product.duration === 'object' 
    ? product.duration?.period || '1 Year' 
    : product.duration || '1 Year';

  const {
    name,
    description,
    discountPrice,
    originalPrice,
    discount,
    features,
    image,
    popular,
    slug,
    brand,
    rating,
    reviews,
    inStock,
    tag,
    category
  } = product;

  // Generate product URL
  const getProductUrl = () => {
    if (!name) return '/buyantivirus';
    
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (typeof slug === 'string') {
      return `/buyantivirus/${encodeURIComponent(slug)}`;
    }
    
    // Fallback for safety
    const safeSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `/buyantivirus/${encodeURIComponent(safeSlug)}`;
  };

  if (!name || !discountPrice) {
    return null;
  }

  return (
    <div className="h-full">
      <Link href={getProductUrl()} className="block h-full">
        {/* Mobile View (up to 640px) */}
        <div className="sm:hidden flex h-full bg-white rounded-lg shadow-sm">
          {/* Mobile Image Section - Square with rounded corners */}
          <div className="w-1/3 relative">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-l-lg"
            />
          </div>
          
          {/* Mobile Content Section */}
          <div className="w-2/3 p-3 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{discountPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {description}
            </p>
          </div>
        </div>

        {/* Tablet and Desktop View (640px and above) */}
        <div className="hidden sm:flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
          {/* Desktop Image Section */}
          <div className="relative w-full h-40 bg-gray-50">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(min-width: 640px) 50vw, (min-width: 1024px) 25vw"
            />
            {popular && (
              <Badge variant="default" className="absolute top-2 right-2 bg-blue-600 text-white">
                Popular
              </Badge>
            )}
          </div>

          {/* Desktop Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 flex-grow">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{discountPrice}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-auto">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 