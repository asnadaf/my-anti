import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/use-toast';

const ProductActionButtons = ({ product, className = '' }) => {
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

  return (
    <div className={`flex gap-4 ${className}`}>
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
      <Link href="/buyantivirus/cart" className="flex-1">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          Buy Now
        </Button>
      </Link>
    </div>
  );
};

export default ProductActionButtons; 