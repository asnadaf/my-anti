"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  devices: number;
  duration: string;
  features: string[];
  image: string;
  popular: boolean;
  slug: string;
  brand: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sku: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-border hover:shadow-lg transition-shadow duration-300" role="article">
      <Link href={`/buyantivirus/products/${product.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.popular && (
            <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
              Popular
            </Badge>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
              {product.name}
            </h3>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm text-gray-600 dark:text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-foreground">
              ${product.price}
            </span>
            <span className="text-gray-500 line-through">
              ${product.originalPrice}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {product.discount}% OFF
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-gray-600 dark:text-muted-foreground">
              {product.devices} Devices
            </Badge>
            <Badge variant="outline" className="text-gray-600 dark:text-muted-foreground">
              {product.duration}
            </Badge>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            View Details
          </Button>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard; 