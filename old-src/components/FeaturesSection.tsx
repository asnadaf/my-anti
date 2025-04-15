import React from 'react';
import { Shield, Lock, Zap, Globe, Key, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Advanced Security",
    description: "State-of-the-art encryption and security protocols to protect your digital assets."
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description: "Your keys are stored in our highly secure, encrypted database with multiple layers of protection."
  },
  {
    icon: Zap,
    title: "Instant Activation",
    description: "Get immediate access to your purchased licenses with our automated delivery system."
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Our services are available worldwide with support for multiple regions and languages."
  },
  {
    icon: Key,
    title: "License Management",
    description: "Easily manage and track all your software licenses in one secure location."
  },
  {
    icon: CheckCircle2,
    title: "Guaranteed Authenticity",
    description: "All our keys are 100% genuine and sourced directly from official vendors."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Powerful Features for Your Security
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the best in digital security with our comprehensive suite of features designed to protect your software investments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 