"use client";

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ProductCard from './ProductCard';
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  discountPrice: number;
  originalPrice: number;
  discount: number;
  devices: number;
  duration: string;
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

interface ProductCarouselProps {
  title: string;
  products: Product[];
  tag?: string;
  tagColor?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  title, 
  products, 
  tag,
  tagColor = 'bg-blue-600'
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {tag && (
          <Badge variant="default" className={`${tagColor} text-white`}>
            {tag}
          </Badge>
        )}
      </div>
      
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={5000}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            >
              <ArrowRight className="h-6 w-6 text-gray-700" />
            </button>
          )
        }
      >
        {products.map((product) => (
          <div key={product.id} className="px-4">
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel; 