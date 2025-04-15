import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function OrderConfirmation() {
  const router = useRouter();
  const { cartItems, calculateTotal } = useCart();
  
  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
  // Redirect to products page if cart is empty (prevents direct access to confirmation page)
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/buyantivirus/products');
    }
  }, [cartItems, router]);

  // If cart is empty, show loading state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate order total
  const orderTotal = calculateTotal() * 1.1; // Including tax

  return (
    <>
      <Head>
        <title>Order Confirmation | SecureKeyMaster</title>
        <meta name="description" content="Your order has been successfully placed" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
              <p className="text-sm text-gray-500 mt-2">Order Total</p>
              <p className="text-lg font-semibold text-gray-900">${orderTotal.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to your email address with order details and download instructions.
            </p>
            <div className="space-y-3">
              <Link href="/buyantivirus/products">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Home
                </button>
              </Link>
              <Link href="/buyantivirus/support">
                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Need Help?
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 