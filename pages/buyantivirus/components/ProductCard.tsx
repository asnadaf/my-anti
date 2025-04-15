"use client";

import React from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: {
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
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200">
      {product.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-blue-600 text-white">Popular Choice</Badge>
        </div>
      )}
      
      <CardHeader className="space-y-2">
        <div className="relative w-full h-48 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="object-contain"
            />
          ) : (
            <Shield className="w-16 h-16 text-gray-400" />
          )}
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            <Badge variant="secondary" className="ml-2">Save {product.discount}%</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>✓ {product.devices} Devices</span>
            <span>✓ {product.duration}</span>
          </div>

          <div className="space-y-2">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 transition-all duration-300 hover:scale-[1.02]">
            Buy Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 