"use client";

import React from 'react';
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "../../components/ui/button";
import { Shield, Users, Award, Globe, ThumbsUp, Clock } from 'lucide-react';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | SecureKeyMaster - Your Trusted Antivirus License Provider</title>
        <meta name="description" content="Learn about SecureKeyMaster's mission to provide genuine antivirus license keys at the best prices with instant delivery and exceptional customer service." />
        <meta name="keywords" content="antivirus license, security software, digital protection, genuine keys" />
        <meta property="og:title" content="About SecureKeyMaster" />
        <meta property="og:description" content="Your trusted source for genuine antivirus license keys with 24/7 support." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://securekeymaster.com/about" />
      </Head>
      <div className="min-h-screen flex flex-col bg-background">
        {/* <Header /> */}
        <main className="flex-grow">
          <section className="bg-security-gradient py-16 dark:bg-gradient-to-br dark:from-blue-900 dark:to-indigo-900" aria-label="About Hero">
            <div className="container mx-auto px-4 text-center">
              <Shield size={64} className="mx-auto mb-6 text-white" aria-hidden="true" />
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">About SecureKeyMaster</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                We're dedicated to providing genuine antivirus license keys at the best prices 
                with instant delivery and exceptional customer service.
              </p>
            </div>
          </section>
          
          <section className="py-16" aria-label="Our Story">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
                <article className="prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
                  <p>
                    Founded in 2015, SecureKeyMaster began with a simple mission: to make premium digital security accessible to everyone. 
                    We noticed that many users were foregoing essential security software due to high prices, which left them vulnerable to cyber threats.
                  </p>
                  <p>
                    By establishing direct relationships with authorized distributors and leveraging bulk purchasing power, 
                    we've been able to offer genuine antivirus license keys at prices significantly below retail, without compromising on quality or authenticity.
                  </p>
                  <p>
                    Today, SecureKeyMaster has served over 50,000 customers worldwide, helping individuals and businesses secure their digital lives 
                    with genuine protection from leading brands like Norton, McAfee, Bitdefender, and more.
                  </p>
                  <p>
                    What sets us apart is not just our competitive pricing, but our commitment to customer satisfaction. 
                    Our dedicated support team works around the clock to ensure a seamless experience, from purchase to activation and beyond.
                  </p>
                </article>
              </div>
            </div>
          </section>
          
          <section className="py-16" aria-label="Our Values">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Award,
                    title: "Authenticity",
                    description: "We stand behind the authenticity of every license key we sell. All our products are sourced from authorized channels and come with a 100% guarantee of successful activation."
                  },
                  {
                    icon: Users,
                    title: "Customer First",
                    description: "Our customers are our priority. We're committed to providing exceptional service, from easy purchasing to responsive support for any questions or issues that may arise."
                  },
                  {
                    icon: Globe,
                    title: "Accessibility",
                    description: "We believe everyone deserves robust digital protection. Our competitive pricing makes premium security software accessible to individuals and businesses of all sizes."
                  },
                  {
                    icon: ThumbsUp,
                    title: "Quality",
                    description: "We only offer products from reputable, established security brands known for their effectiveness and reliability in protecting against the latest digital threats."
                  },
                  {
                    icon: Clock,
                    title: "Efficiency",
                    description: "Time matters when it comes to security. Our instant delivery system ensures you receive your license key immediately after purchase, allowing for immediate protection."
                  },
                  {
                    icon: Shield,
                    title: "Security",
                    description: "We practice what we preach. All transactions on our platform are secured with advanced encryption, and we never store sensitive payment information."
                  }
                ].map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <article key={index} className="bg-card p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 dark:border dark:border-border">
                      <div className="bg-security-lightBlue p-4 rounded-full inline-block mb-4">
                        <Icon size={32} className="text-security-blue dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
          
          <section className="py-16" aria-label="Our Promise">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Promise to You</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  At SecureKeyMaster, we're committed to providing you with genuine antivirus license keys at the best prices,
                  backed by exceptional service and support.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild className="bg-security-blue hover:bg-security-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <a href="/products" aria-label="Browse our products">Browse Products</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/contact" aria-label="Contact our support team">Contact Us</a>
                  </Button>
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