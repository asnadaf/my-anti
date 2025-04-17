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
          <div className="relative w-[100px] h-[100px] flex-shrink-0 p-2">
            <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain p-1.5"
                sizes="100px"
              />
              {popular && (
                <Badge variant="default" className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] px-1 py-0">
                  Popular
                </Badge>
              )}
            </div>
          </div>

          {/* Mobile Content Section */}
          <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">{name}</h3>
              {brand && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-gray-500 truncate">{brand}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded">{category || 'Antivirus'}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-gray-900">${discountPrice.toFixed(2)}</span>
                {originalPrice > discountPrice && (
                  <span className="text-[10px] text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                )}
                {discount > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[10px] h-4 px-1 ml-auto">
                    {discount}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[10px] text-gray-500 truncate">
                  {deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'} • {durationPeriod}
                </div>
                <Button variant="default" size="sm" className="h-6 px-3 text-[11px] bg-blue-600 hover:bg-blue-700 text-white">
                  View
                </Button>
              </div>
            </div>
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
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
              {brand && (
                <span className="text-sm text-gray-500">{brand}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold text-gray-900">${discountPrice.toFixed(2)}</span>
              {originalPrice > discountPrice && (
                <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  {discount}% OFF
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'} • {durationPeriod}
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