"use client";

import React from 'react';
  // import { Header } from "@/components/Header";
  // import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Head from 'next/head';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | SecureKeyMaster - 24/7 Support</title>
        <meta name="description" content="Get in touch with SecureKeyMaster's support team. We're here to help with any questions about antivirus licenses, purchases, or technical support." />
        <meta name="keywords" content="antivirus support, contact support, license help, technical support" />
        <meta property="og:title" content="Contact SecureKeyMaster Support" />
        <meta property="og:description" content="24/7 support for all your antivirus license needs." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://securekeymaster.com/contact" />
      </Head>
      <div className="min-h-screen flex flex-col bg-background">
        {/* <Header /> */}
        <main className="flex-grow">
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 dark:bg-gradient-to-br dark:from-blue-900 dark:to-indigo-900" aria-label="Contact Hero">
            <div className="container mx-auto px-4 text-center">
              <Mail size={64} className="mx-auto mb-6 text-white" aria-hidden="true" />
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Have questions? We're here to help. Get in touch with our team for support,
                inquiries, or any assistance you need.
              </p>
            </div>
          </section>

          <section className="py-16" aria-label="Contact Form and Information">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <article className="bg-white dark:bg-card p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-border">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-foreground">Send us a Message</h2>
                    <form className="space-y-6" aria-label="Contact form">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          className="w-full"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className="w-full"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          className="w-full"
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Your message"
                          className="min-h-[150px] w-full"
                          aria-required="true"
                        />
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        type="submit"
                        aria-label="Submit contact form"
                      >
                        Send Message
                      </Button>
                    </form>
                  </article>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    {[
                      {
                        icon: Mail,
                        title: "Email Support",
                        content: "support@securekeymaster.com",
                        description: "24/7 email support"
                      },
                      {
                        icon: Phone,
                        title: "Phone",
                        content: "+1 (555) 123-4567",
                        description: "Mon-Fri, 9AM-6PM EST"
                      },
                      {
                        icon: MapPin,
                        title: "Office Location",
                        content: "123 Security Street, Tech Valley, CA 94025",
                        description: "United States"
                      },
                      {
                        icon: Clock,
                        title: "Business Hours",
                        content: "Monday - Friday: 9:00 AM - 6:00 PM",
                        description: "Saturday: 10:00 AM - 4:00 PM | Sunday: Closed"
                      }
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <article
                          key={index}
                          className="bg-white dark:bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-border"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-1">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-muted-foreground mb-1">{item.content}</p>
                              <p className="text-sm text-gray-500 dark:text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
} 