import React from 'react';
import { Button } from "../../../components/ui/button";
import { ArrowRight, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '@lib/types';

interface HeroSectionProps {
  product: Product | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ product }) => {
  if (!product) return null;

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-gray-800/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.1))]" />
      
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Secure Your Digital Life with Key Guardian
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Protect your software licenses and digital keys with our advanced security solutions. Get instant delivery and 24/7 support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 rounded-2xl blur-3xl" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.duration} Protection</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">${product.discountPrice}</div>
                      {product.originalPrice > product.discountPrice && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">${product.originalPrice}</div>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Up to {product.devices} Devices</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 