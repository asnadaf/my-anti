"use client";

import React from 'react';
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, LifeBuoy, FileText, MessageCircle, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
// import { SupportContent } from "@/components/pages/SupportContent";
import type { Metadata } from 'next';

const supportFaqs = [
  {
    question: "How do I activate my license key?",
    answer: "After purchasing, you'll receive an email with your license key and detailed activation instructions. Generally, you'll need to download the software from the official website, install it, and enter your license key during the activation process."
  },
  {
    question: "My key isn't working. What should I do?",
    answer: "First, ensure you've entered the key exactly as provided in your email (case sensitive, with all dashes). If it still doesn't work, try restarting your device and attempting again. If the problem persists, please contact our support team with your order number."
  },
  {
    question: "How long does it take to receive my license key?",
    answer: "License keys are delivered automatically and instantly after your payment is confirmed. If you haven't received your key within 15 minutes, please check your spam/junk folder. If it's not there, contact our support team immediately."
  },
  {
    question: "Can I transfer my license to another device?",
    answer: "Most licenses can be transferred by deactivating on one device before activating on another. The specific process varies by product. For detailed instructions for your specific product, please contact our support team."
  },
  {
    question: "Are there any refunds if I'm not satisfied?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with your purchase. Contact our support team with your order details to initiate the refund process."
  }
];

const installationGuides = [
  {
    title: "Norton Installation Guide",
    steps: [
      "Download Norton from the official Norton website.",
      "Run the installer and follow the on-screen instructions.",
      "When prompted, enter your license key exactly as provided in your email.",
      "Complete the installation and run a quick scan to ensure everything is working properly."
    ]
  },
  {
    title: "McAfee Installation Guide",
    steps: [
      "Visit the official McAfee website and download the installer.",
      "Run the downloaded file and follow the installation wizard.",
      "Enter your license key when prompted during the activation process.",
      "Restart your computer to complete the installation."
    ]
  },
  {
    title: "Bitdefender Installation Guide",
    steps: [
      "Download Bitdefender from the official website.",
      "Run the installer and follow the setup wizard.",
      "Create or log in to your Bitdefender Central account when prompted.",
      "Enter your license key to activate the product.",
      "Complete the installation process and run an initial scan."
    ]
  },
  {
    title: "Kaspersky Installation Guide",
    steps: [
      "Go to the official Kaspersky website and download the appropriate installer.",
      "Run the installation file and follow the on-screen instructions.",
      "When prompted, enter your activation code as provided in your email.",
      "Complete the setup and run a system scan to verify installation."
    ]
  }
];

export default function SupportPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* <Header /> */}
      
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Customer Support
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            We're here to help with any questions or issues you may have with your antivirus license keys.
          </p>
        </div>
      </div>

      {/* Main content section with white background */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="help">
              <HelpCircle className="h-4 w-4 mr-2" /> Help Center
            </TabsTrigger>
            <TabsTrigger value="installation">
              <FileText className="h-4 w-4 mr-2" /> Installation Guides
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="h-4 w-4 mr-2" /> Contact Us
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="help" className="mt-0">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {supportFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <LifeBuoy className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Still Need Help?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our support team is available 24/7 to assist you with any questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">+1 (888) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">support@keyguardian.com</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="installation" className="mt-0">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Installation Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {installationGuides.map((guide, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">{guide.title}</CardTitle>
                    <CardDescription>Step-by-step installation instructions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Need more detailed instructions or help with a specific issue?
              </p>
              <Button 
                variant="link"
                className="text-blue-600 dark:text-blue-400"
                onClick={() => {
                  const contactTab = document.querySelector('[data-value="contact"]') as HTMLElement;
                  if (contactTab) {
                    contactTab.click();
                  }
                }}
              >
                Contact our support team <MessageCircle className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Get In Touch</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Have questions or need assistance? Our support team is here to help.
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Send Message <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300">support@keyguardian.com</p>
                      <p className="text-gray-600 dark:text-gray-300">sales@keyguardian.com</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-300">Support: +1 (888) 123-4567</p>
                      <p className="text-gray-600 dark:text-gray-300">Sales: +1 (888) 765-4321</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Hours</h4>
                      <p className="text-gray-600 dark:text-gray-300">24/7 Support</p>
                      <p className="text-gray-600 dark:text-gray-300">Sales: Mon-Fri, 9am-5pm EST</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h4 className="font-medium text-center text-gray-900 dark:text-white mb-3">Response Times</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 dark:bg-gray-800 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Email Support</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Within 2 hours</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-gray-800 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Live Chat</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Immediate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* <Footer /> */}
    </main>
  );
} 