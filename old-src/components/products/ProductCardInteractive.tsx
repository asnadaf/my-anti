"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProductCardInteractiveProps {
  productId: number;
}

export function ProductCardInteractive({ productId }: ProductCardInteractiveProps) {
  return (
    <Button className="w-full" variant="default" asChild>
      <Link href={`/products/${productId}`}>
        View Details
      </Link>
    </Button>
  )
} 