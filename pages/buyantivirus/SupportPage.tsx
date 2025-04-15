"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from 'lucide-react';

export function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12">Support Center</h1>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Support */}
            <div className="bg-card p-8 rounded-lg shadow-md">
              <Mail className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Email Support</h2>
              <p className="text-muted-foreground mb-6">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <Button className="w-full">
                <a href="mailto:support@securekeymaster.com">Email Us</a>
              </Button>
            </div>

            {/* Live Chat */}
            <div className="bg-card p-8 rounded-lg shadow-md">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Live Chat</h2>
              <p className="text-muted-foreground mb-6">
                Chat with our support team in real-time for immediate assistance.
              </p>
              <Button className="w-full">
                Start Chat
              </Button>
            </div>

            {/* Phone Support */}
            <div className="bg-card p-8 rounded-lg shadow-md">
              <Phone className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Phone Support</h2>
              <p className="text-muted-foreground mb-6">
                Call us for immediate assistance during business hours.
              </p>
              <Button className="w-full">
                <a href="tel:+1234567890">Call Us</a>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Common Support Topics</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button variant="outline" className="h-auto py-4">
                <a href="/buyantivirus/faq">View FAQ</a>
              </Button>
              <Button variant="outline" className="h-auto py-4">
                Installation Guides
              </Button>
              <Button variant="outline" className="h-auto py-4">
                License Key Activation
              </Button>
              <Button variant="outline" className="h-auto py-4">
                Troubleshooting
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 