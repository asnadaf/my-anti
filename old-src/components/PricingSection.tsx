import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: "$29.99",
    description: "Perfect for individual users",
    features: [
      "1 Device License",
      "Basic Security Features",
      "Email Support",
      "30-Day Money Back",
      "Instant Delivery"
    ]
  },
  {
    name: "Professional",
    price: "$49.99",
    description: "Ideal for small businesses",
    features: [
      "5 Device License",
      "Advanced Security Features",
      "Priority Support",
      "60-Day Money Back",
      "Instant Delivery",
      "License Management"
    ],
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "$99.99",
    description: "For large organizations",
    features: [
      "Unlimited Devices",
      "Premium Security Features",
      "24/7 Dedicated Support",
      "90-Day Money Back",
      "Instant Delivery",
      "License Management",
      "Bulk Purchase Discounts"
    ]
  }
];

const PricingSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core security features and 24/7 support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                plan.badge ? 'border-2 border-blue-500 dark:border-blue-400' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {plan.price}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.badge 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 