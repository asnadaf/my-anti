import React from 'react';
import { Shield, Zap, Clock, Lock, Globe, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: "100% Genuine Keys",
    description: "All our antivirus keys are directly sourced from official vendors, ensuring authenticity and reliability."
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Receive your license key immediately after purchase via email, with no waiting time."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you with any issues."
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "All payments are processed through secure, encrypted channels to protect your information."
  },
  {
    icon: Globe,
    title: "Global Availability",
    description: "Our services are available worldwide, with support for multiple languages and currencies."
  },
  {
    icon: Headphones,
    title: "Expert Assistance",
    description: "Get help from our team of security experts for installation and troubleshooting."
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose Key Guardian?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide the best value and service in the industry, backed by our commitment to quality and customer satisfaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 