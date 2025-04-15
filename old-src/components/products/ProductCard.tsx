// Server Component
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { ProductCardInteractive } from './ProductCardInteractive'
import { Button } from '@/components/ui/button'

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
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          priority={product.popular} // Prioritize loading for popular products
        />
        {product.popular && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          </div>
          <span className="text-sm font-semibold text-blue-600">
            {product.discount}% OFF
          </span>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">🖥️</span>
            {product.devices} Devices
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⏱️</span>
            {product.duration} License
          </div>
        </div>

        {/* Interactive Part */}
        <ProductCardInteractive productId={product.id} />
      </div>
    </div>
  )
} 