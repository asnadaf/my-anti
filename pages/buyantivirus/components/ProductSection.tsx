import React from 'react';
import { Button } from "../../../components/ui/button";
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  devices: number;
  duration: string;
  features: string[];
  badgeText?: string;
}

const products: Product[] = [
  {
    id: "norton-360-deluxe",
    name: "Norton 360 Deluxe",
    brand: "Norton",
    price: 29.99,
    originalPrice: 79.99,
    devices: 5,
    duration: "1 Year",
    features: ["Real-Time Threat Protection", "Secure VPN", "Password Manager", "Cloud Backup", "Dark Web Monitoring"],
    badgeText: "Most Popular"
  },
  {
    id: "mcafee-total-protection",
    name: "McAfee Total Protection",
    brand: "McAfee",
    price: 34.99,
    originalPrice: 89.99,
    devices: 5,
    duration: "1 Year",
    features: ["Antivirus Protection", "Performance Optimization", "Home Network Security", "Password Manager", "Safe Web Browsing"]
  },
  {
    id: "bitdefender-total-security",
    name: "Bitdefender Total Security",
    brand: "Bitdefender",
    price: 39.99,
    originalPrice: 94.99,
    devices: 5,
    duration: "1 Year",
    features: ["Multi-Layer Ransomware Protection", "Network Threat Prevention", "Microphone Monitor", "Anti-Theft Tools", "Privacy Firewall"]
  },
  {
    id: "kaspersky-internet-security",
    name: "Kaspersky Internet Security",
    brand: "Kaspersky",
    price: 24.99,
    originalPrice: 69.99,
    devices: 3,
    duration: "1 Year",
    features: ["Anti-Phishing Protection", "Safe Money Mode", "VPN Connection", "Anti-Banner", "Webcam Protection"]
  }
];

const ProductSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Top Antivirus Solutions</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Protect your devices with industry-leading antivirus software. All our keys are 100% genuine, with instant delivery and full support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
              {product.badgeText && (
                <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-white text-xs font-semibold">
                  {product.badgeText}
                </div>
              )}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{product.brand}</p>
                </div>
                <div className="mb-6 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <Shield size={16} className="mr-1 text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{product.devices} Devices</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{product.duration}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Zap size={16} className="mr-2 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center">
            View All Products <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection; 