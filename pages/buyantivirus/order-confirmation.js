import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, ArrowLeft, Home, Copy, Download } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [licenseKeys, setLicenseKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect to products page if no orderId (prevents direct access to confirmation page)
  useEffect(() => {
    if (!orderId) {
      router.push('/buyantivirus');
    } else {
      // Fetch order details
      fetchOrderDetails();
    }
  }, [orderId, router]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setOrder(data.order);
      setLicenseKeys(data.licenseKeys || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLicenseKeys = () => {
    const keysText = licenseKeys.join('\n');
    navigator.clipboard.writeText(keysText).then(() => {
      toast({
        title: "Copied!",
        description: "License keys have been copied to your clipboard.",
      });
    });
  };

  const downloadLicenseKeys = () => {
    const keysText = licenseKeys.join('\n');
    const blob = new Blob([keysText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `license-keys-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no order data, show error
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/buyantivirus">
            <Button>Return to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmation | SecureKeyMaster</title>
        <meta name="description" content="Your order has been successfully placed" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-500">Order Number</span>
                <span className="text-sm font-medium text-gray-900">{order._id}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-500">Order Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-gray-500">Total Amount</span>
                <span className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {licenseKeys.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your License Keys</h2>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="space-y-2">
                    {licenseKeys.map((key, index) => (
                      <div key={index} className="font-mono text-sm">{key}</div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={copyLicenseKeys} variant="outline" className="flex items-center">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Keys
                  </Button>
                  <Button onClick={downloadLicenseKeys} variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Keys
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  A confirmation email has been sent to your email address with these license keys.
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <Link href="/buyantivirus">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/client/purchase-history">
                  <Button className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    View Purchase History
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 