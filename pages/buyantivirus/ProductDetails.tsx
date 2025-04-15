"use client";

import React from 'react';
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, Clock, Zap, Star } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  image: string;
  devices: number;
  duration: string;
  rating: number;
  reviews: number;
}

// This would typically come from an API or database
const product: Product = {
  id: "1",
  name: "Norton 360 Deluxe",
  brand: "Norton",
  price: 49.99,
  originalPrice: 99.99,
  description: "Comprehensive protection for your digital life. Norton 360 Deluxe provides advanced security for your devices, online privacy, and more.",
  features: [
    "Real-time threat protection",
    "Secure VPN for online privacy",
    "Password manager",
    "50GB cloud backup",
    "Parental controls",
    "Dark web monitoring"
  ],
  image: "/images/norton-360-deluxe.jpg",
  devices: 5,
  duration: "1 Year",
  rating: 4.8,
  reviews: 1250
};

export function ProductDetails() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Header /> */}
      
      <main className="flex-grow">
        {/* Hero section with gradient background */}
        <div className="bg-security-gradient py-12 dark:bg-gradient-to-br dark:from-blue-900 dark:to-indigo-900">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Product Details
            </h1>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-border">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <span className="text-sm text-security-blue dark:text-blue-400 font-medium">
                  {product.brand}
                </span>
                <h2 className="text-3xl font-bold text-foreground mt-2">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-security-blue dark:text-blue-400" />
                    <span>{product.devices} Devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-security-blue dark:text-blue-400" />
                    <span>{product.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-security-blue dark:text-blue-400" />
                      <span className="text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <Button size="lg" className="w-full bg-security-blue hover:bg-security-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-security-blue dark:text-blue-400" />
                <span>Instant delivery via email</span>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Product Description
            </h3>
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-border">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
} 