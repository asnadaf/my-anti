import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/ui/use-toast';

// Cart item component
const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.brand || 'SecureKeyMaster'}</p>
        <div className="flex items-center mt-2">
          <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Minus className="h-4 w-4 text-gray-600" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <button
        onClick={() => onRemoveItem(item.id)}
        className="p-2 text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

// Checkout form component
const CheckoutForm = ({ total, onCheckout, isProcessing }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cashfree', // Default to Cashfree
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCheckout(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="cashfree"
              name="paymentMethod"
              value="cashfree"
              checked={formData.paymentMethod === 'cashfree'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="cashfree" className="ml-3 block text-sm font-medium text-gray-700">
              Cashfree (Credit/Debit Card, UPI, Net Banking)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
              Cash on Delivery
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between mb-4">
          <span className="text-base font-medium text-gray-900">Subtotal</span>
          <span className="text-base font-medium text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-base font-medium text-gray-900">Tax</span>
          <span className="text-base font-medium text-gray-900">${(total * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">${(total * 1.1).toFixed(2)}</span>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Lock className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </form>
  );
};

// Main Cart Dashboard component
export default function CartDashboard() {
  const router = useRouter();
  const { cartItems, isLoading, updateQuantity, removeItem, calculateTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const checkAvailability = async (formData) => {
    setIsProcessing(true);
    
    try {
      // Calculate total amount including tax
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      const tax = subtotal * 0.1; // 10% tax
      const totalAmount = (subtotal + tax).toFixed(2); // Format to 2 decimal places

      // Prepare the data for the API
      const checkoutData = {
        items: cartItems,
        amount: parseFloat(totalAmount), // Ensure it's a number
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        confirmOrder: false // This is just a check
      };
      
      // Call the checkout API for availability check
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check availability');
      }
      
      const data = await response.json();
      setAvailabilityData(data);
      
      // Always show the modal, regardless of availability
      setShowAvailabilityModal(true);
      
      // If no items are available, show a toast notification
      if (!data.canProceed) {
        toast({
          title: "No items available",
          description: "None of the items in your cart are available for purchase.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Availability check error:', error);
      toast({
        title: "Check failed",
        description: error.message || "There was an error checking item availability. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const completeOrder = async (formData) => {
    setIsProcessing(true);
    
    try {
      // Calculate total amount including tax
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      const tax = subtotal * 0.1; // 10% tax
      const totalAmount = (subtotal + tax).toFixed(2); // Format to 2 decimal places

      console.log('Calculated amounts:', {
        subtotal,
        tax,
        totalAmount
      }); // Debug log

      // Prepare the data for the API
      const checkoutData = {
        items: cartItems,
        amount: parseFloat(totalAmount), // Ensure it's a number
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        confirmOrder: true
      };

      console.log('Sending checkout data:', checkoutData); // Debug log
      
      // Call the checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process checkout');
      }
      
      const result = await response.json();
      
      // If using Cashfree, redirect to payment page
      if (formData.paymentMethod === 'cashfree' && result.paymentUrl) {
        // Redirect to Cashfree payment page
        window.location.href = result.paymentUrl;
        return;
      }
      
      // For non-Cashfree payments, clear cart and redirect to confirmation
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will be redirected to the confirmation page.",
        duration: 3000,
      });
      
      // Redirect to order confirmation page with order ID
      router.push(`/buyantivirus/order-confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
      setShowAvailabilityModal(false);
    }
  };

  // Availability confirmation modal
  const AvailabilityModal = () => {
    if (!availabilityData) return null;
    
    const { availableItems, unavailableItems, total, canProceed } = availabilityData;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <h2 className="text-xl font-bold mb-4">Item Availability</h2>
          
          {!canProceed && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-lg font-medium text-red-600 mb-2">No Items Available</h3>
              <p className="text-gray-700">
                Unfortunately, none of the items in your cart are currently available for purchase. 
                Please remove unavailable items or try again later.
              </p>
            </div>
          )}
          
          {unavailableItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-red-600 mb-2">Unavailable Items</h3>
              <ul className="space-y-2">
                {unavailableItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-red-600">
                      {item.message || `Requested: ${item.requested}, In Stock: ${item.inStock}, Available Keys: ${item.availableKeys}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {availableItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-green-600 mb-2">Available Items</h3>
              <ul className="space-y-2">
                {availableItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} (Qty: {item.requested})</span>
                    <span>${item.total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAvailabilityModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {canProceed ? 'Cancel' : 'Close'}
            </button>
            
            {canProceed && (
              <button
                onClick={() => {
                  // Get the form data from the CheckoutForm
                  const form = document.querySelector('form');
                  if (form) {
                    const formData = new FormData(form);
                    const data = {};
                    for (const [key, value] of formData.entries()) {
                      data[key] = value;
                    }
                    completeOrder(data);
                  } else {
                    toast({
                      title: "Error",
                      description: "Could not find form data. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Proceed with Available Items'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Shopping Cart | SecureKeyMaster</title>
        <meta name="description" content="Review and checkout your antivirus software purchases" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/buyantivirus/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Shopping Cart</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link href="/buyantivirus/products">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Takes up 2/3 of the space */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Cart Items ({cartItems.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Checkout Section - Takes up 1/3 of the space */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <CheckoutForm 
                    total={calculateTotal()} 
                    onCheckout={checkAvailability} 
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showAvailabilityModal && <AvailabilityModal />}
    </>
  );
} 