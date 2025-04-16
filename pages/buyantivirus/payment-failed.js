import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailed() {
  const router = useRouter();
  const { orderId, reason } = router.query;

  return (
    <>
      <Head>
        <title>Payment Failed | SecureKeyMaster</title>
        <meta name="description" content="Payment failed for your order" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              
              {reason && (
                <p className="text-gray-600 mb-6">
                  {decodeURIComponent(reason)}
                </p>
              )}
              
              {!reason && (
                <p className="text-gray-600 mb-6">
                  We couldn't process your payment. This could be due to insufficient funds, incorrect card details, or a temporary issue with the payment gateway.
                </p>
              )}
              
              {orderId && (
                <div className="bg-gray-50 p-4 rounded-md mb-6 w-full">
                  <p className="text-sm text-gray-600">
                    Order ID: <span className="font-medium">{orderId}</span>
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link href="/buyantivirus/cart" className="flex-1">
                  <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Cart
                  </button>
                </Link>
                
                <button 
                  onClick={() => router.reload()}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                <p>If you continue to experience issues, please contact our support team.</p>
                <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 