import React from 'react';
import { Button } from "../../../components/ui/button";
import { ArrowRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of satisfied customers who trust Key Guardian for their digital security needs. Get started today and enjoy peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Browse Products <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 