import React from 'react';
import { Shield, CheckCircle2, Award, Users } from 'lucide-react';

const stats = [
  {
    icon: Shield,
    value: "10,000+",
    label: "Secure Transactions"
  },
  {
    icon: CheckCircle2,
    value: "99.9%",
    label: "Customer Satisfaction"
  },
  {
    icon: Award,
    value: "5+",
    label: "Years of Experience"
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers"
  }
];

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join our growing community of satisfied customers who trust Key Guardian for their digital security needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 