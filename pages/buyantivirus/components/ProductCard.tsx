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
    tag
  } = product;

  // Generate product URL
  const productUrl = slug 
    ? `/buyantivirus/products/${slug}` 
    : `/buyantivirus/products/${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {popular && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-blue-600 text-white">
            Popular
          </Badge>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {brand && (
            <span className="text-sm text-gray-500">{brand}</span>
          )}
        </div>
        
        <div className="flex items-center mb-2">
          {rating && (
            <div className="flex items-center mr-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          {reviews && (
            <span className="text-sm text-gray-500">({reviews} reviews)</span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-gray-900">${discountPrice.toFixed(2)}</span>
          {originalPrice > discountPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
          {discount > 0 && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
              {discount}% OFF
            </Badge>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{deviceCount} {deviceCount === 1 ? 'Device' : 'Devices'}</span>
          <span className="mx-2">•</span>
          <span>{durationPeriod}</span>
        </div>

        <div className="space-y-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Link href={productUrl} passHref>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 