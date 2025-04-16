"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Filter, Search } from 'lucide-react';
import { fetchProducts } from '../../../lib/products';
import { fetchCategories } from '../../../lib/categories';

// Define the Product interface
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
}

// Define the Category interface
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
}

export default function BuyAntivirusPage({ products: initialProducts = [], categories = [] }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>(Array.isArray(initialProducts) ? initialProducts : []);

  // Ensure products is always an array
  const productsArray = Array.isArray(products) ? products : [];
  
  const filteredProducts = productsArray
    .filter(product => product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'popular') return product?.popular;
      if (selectedFilter === 'under30') return product?.discountPrice < 30;
      if (selectedFilter === 'multidevice') return product?.devices > 3;
      return true;
    });

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "SecureKeyMaster"
        },
        "sku": product.sku,
        "offers": {
          "@type": "Offer",
          "price": product.discountPrice.toString(),
          "priceCurrency": "RS",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "aggregateRating": product.rating ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating.toString(),
          "reviewCount": product.reviews?.toString() || "0"
        } : undefined
      }
    }))
  };

  return (
    <>
      <Head>
        <title>Antivirus License Keys | SecureKeyMaster - Genuine Software Protection</title>
        <meta name="description" content="Browse our selection of 100% authentic antivirus license keys from top brands like Norton, McAfee, and Bitdefender. Instant delivery and 24/7 support." />
        <meta name="keywords" content="antivirus license, security software, Norton, McAfee, Bitdefender, Kaspersky, ESET, Avast" />
        <meta property="og:title" content="Genuine Antivirus License Keys" />
        <meta property="og:description" content="Get authentic antivirus license keys with instant delivery and 24/7 support." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://securekeymaster.com/products" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <CategoryBar categories={categories} />

        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Genuine Antivirus License Keys</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Browse 100% authentic antivirus keys from trusted brands. Instant delivery & 24/7 support.
          </p>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === 'all' ? "default" : "outline"}
                onClick={() => setSelectedFilter('all')}
              >
                All Products
              </Button>
              <Button
                variant={selectedFilter === 'popular' ? "default" : "outline"}
                onClick={() => setSelectedFilter('popular')}
              >
                <Filter className="h-4 w-4 mr-1" /> Popular
              </Button>
              <Button
                variant={selectedFilter === 'under30' ? "default" : "outline"}
                onClick={() => setSelectedFilter('under30')}
              >
                Under $30
              </Button>
              <Button
                variant={selectedFilter === 'multidevice' ? "default" : "outline"}
                onClick={() => setSelectedFilter('multidevice')}
              >
                Multi-Device
              </Button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// Server-side rendering with getServerSideProps
export async function getServerSideProps() {
  try {
    // Fetch products and categories from the database
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
    
    return {
      props: {
        products,
        categories,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        products: [],
        categories: [],
      },
    };
  }
}
