import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Lock } from 'lucide-react';

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
const CheckoutForm = ({ total, onCheckout }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                placeholder="1234 5678 9012 3456"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
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
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Lock className="h-4 w-4 mr-2" />
          Complete Purchase
        </button>
      </div>
    </form>
  );
};

// Main Cart Dashboard component
export default function CartDashboard() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from an API or localStorage
    const mockCartItems = [
      {
        id: '1',
        name: 'Norton 360 Deluxe',
        brand: 'Norton',
        price: 49.99,
        originalPrice: 79.99,
        quantity: 1,
        image: '/images/products/norton-360-deluxe.jpg',
      },
      {
        id: '2',
        name: 'McAfee Total Protection',
        brand: 'McAfee',
        price: 39.99,
        originalPrice: 59.99,
        quantity: 1,
        image: '/images/products/mcafee-total-protection.jpg',
      },
    ];
    
    setCartItems(mockCartItems);
    setIsLoading(false);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = (formData) => {
    // In a real app, this would process the payment and create an order
    console.log('Processing checkout with:', formData);
    alert('Order placed successfully!');
    router.push('/buyantivirus/order-confirmation');
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
                  <CheckoutForm total={calculateTotal()} onCheckout={handleCheckout} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 