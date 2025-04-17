import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Star, Check, Shield, Clock, ArrowLeft, ShoppingCart } from 'lucide-react';
import { fetchProductBySlug } from '../../../lib/products';
import { GetServerSideProps } from 'next';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../components/ui/use-toast';
import ProductActionButtons from '../../../components/cart/ProductActionButtons';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  discountPrice: number;
  originalPrice?: number;
  discount?: number;
  devices?: number;
  duration?: string | {
    name: string;
    devices: number;
    period: string;
  };
  features: string[];
  image: string;
  popular?: boolean;
  brand?: string;
  category?: {
    _id: string;
    name: string;
  };
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  sku?: string;
}

interface ProductDetailsPageProps {
  product: Product | null;
  error?: string;
}

export default function ProductDetailsPage({ product, error }: ProductDetailsPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    }
  };

  if (!product) {
    return (
      <>
        <Head>
          <title>Product Not Found | SecureKeyMaster</title>
          <meta name="description" content="The product you're looking for doesn't exist or has been removed." />
          <meta name="robots" content="noindex, follow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/buyantivirus/products">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "SecureKeyMaster"
    },
    "sku": product.sku,
    "image": product.image,
    "offers": {
      "@type": "Offer",
      "price": product.discountPrice.toString(),
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviews?.toString() || "0"
    } : undefined
  };

  return (
    <>
      <Head>
        <title>{`${product.name} | SecureKeyMaster - Genuine Software Protection`}</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.name}, antivirus, security software, ${product.brand || ''}, ${product.category?.name || ''}`} />
        <meta property="og:title" content={`${product.name} - SecureKeyMaster`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.image} />
        <link rel="canonical" href={`https://securekeymaster.com/buyantivirus/products/${product.slug}`} />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero section with gradient background */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {product.category && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </Badge>
              )}
              {product.popular && (
                <Badge variant="default" className="bg-blue-600 text-white">
                  Popular Choice
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-blue-100 text-center mt-2">
                by {product.brand}
              </p>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              {/* Price Section */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-blue-600">${product.discountPrice.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.discountPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Save {product.discount}%
                    </Badge>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                    {product.reviews && (
                      <span className="text-gray-500">({product.reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                {product.devices && (
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Devices</p>
                      <p className="font-medium">{product.devices}</p>
                    </div>
                  </div>
                )}
                {product.duration && (
                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">
                        {typeof product.duration === 'object' 
                          ? `${product.duration.devices} Devices - ${product.duration.period}`
                          : product.duration}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <ProductActionButtons product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const slug = params?.slug as string;
  
  if (!slug) {
    return {
      redirect: {
        destination: '/buyantivirus/products',
        permanent: false,
      },
    };
  }

  try {
    const decodedSlug = decodeURIComponent(slug);
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 5000);
    });
    
    // Race between the product fetch and the timeout
    const product = await Promise.race([
      fetchProductBySlug(decodedSlug),
      timeoutPromise
    ]).catch(error => {
      console.error('Error or timeout fetching product:', error);
      return null;
    });

    if (!product) {
      return {
        props: {
          product: null,
          error: 'Product not found'
        },
      };
    }

    // Ensure all required fields are present and properly formatted
    const sanitizedProduct = {
      ...product,
      _id: product._id?.toString() || '',
      name: product.name || '',
      slug: product.slug || decodedSlug,
      description: product.description || '',
      discountPrice: Number(product.discountPrice) || 0,
      originalPrice: Number(product.originalPrice) || 0,
      features: Array.isArray(product.features) ? product.features : [],
      image: product.image || '/placeholder-image.jpg',
      brand: product.brand || '',
      category: product.category ? {
        _id: product.category._id?.toString() || '',
        name: product.category.name || ''
      } : null,
      rating: Number(product.rating) || 0,
      reviews: Number(product.reviews) || 0,
      inStock: Boolean(product.inStock),
      sku: product.sku || '',
      devices: Number(product.devices) || 1,
      duration: product.duration ? {
        name: product.duration.name || '1 Year',
        devices: Number(product.duration.devices) || 1,
        period: product.duration.period || '1 Year'
      } : '1 Year'
    };

    return {
      props: {
        product: sanitizedProduct,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return a not found state instead of redirecting
    return {
      props: {
        product: null,
        error: error instanceof Error ? error.message : 'Failed to load product'
      },
    };
  }
};