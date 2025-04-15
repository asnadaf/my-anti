"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQPage() {
  const faqs = [
    {
      question: "How do I receive my antivirus license key?",
      answer: "License keys are delivered instantly via email after purchase. You'll receive a confirmation email with your license key and installation instructions."
    },
    {
      question: "Are the license keys genuine?",
      answer: "Yes, all our license keys are 100% genuine and purchased directly from the manufacturers or authorized distributors."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are processed through secure payment gateways."
    },
    {
      question: "Can I use the license key on multiple devices?",
      answer: "The number of devices depends on the specific product you purchase. Each product listing clearly states the number of devices the license covers."
    },
    {
      question: "What if I need help with installation?",
      answer: "We provide detailed installation instructions with each purchase. Our support team is also available 24/7 to assist you with any installation issues."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase. Please contact our support team for assistance."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-foreground">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-200 dark:border-border">
                <AccordionTrigger className="text-lg font-semibold text-gray-900 dark:text-foreground hover:text-blue-600 dark:hover:text-blue-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
} 