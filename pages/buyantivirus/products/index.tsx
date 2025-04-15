"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { CategoryBar } from '../components/CategoryBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

// Dummy product data (move to external file or API later)
const productsData = [
  {
    id: 1,
    name: "Norton 360 Deluxe",
    description: "Complete protection for up to 5 devices with secure VPN and dark web monitoring.",
    price: 29.99,
    originalPrice: 79.99,
    discount: 63,
    devices: 5,
    duration: "1 Year",
    features: ["Real-time threat protection", "Secure VPN", "Password Manager", "Dark Web Monitoring", "50GB Cloud Backup"],
    image: "/images/products/norton.png",
    popular: true
  },
  {
    id: 2,
    name: "McAfee Total Protection",
    description: "Advanced security suite with identity protection for up to 10 devices.",
    price: 34.99,
    originalPrice: 89.99,
    discount: 61,
    devices: 10,
    duration: "1 Year",
    features: ["Virus Protection", "Identity Monitoring", "Secure VPN", "Password Manager", "File Shredder"],
    image: "/images/products/mcafee.png",
    popular: false
  },
  {
    id: 3,
    name: "Bitdefender Total Security",
    description: "Premium protection against all cyber threats for up to 5 devices.",
    price: 32.99,
    originalPrice: 84.99,
    discount: 61,
    devices: 5,
    duration: "1 Year",
    features: ["Anti-Malware", "Multi-Layer Ransomware Protection", "Webcam Protection", "Anti-Phishing", "Anti-Fraud"],
    image: "/images/products/bitdefender.png",
    popular: false
  },
  {
    id: 4,
    name: "Kaspersky Internet Security",
    description: "Essential protection for your privacy, money and kids online.",
    price: 24.99,
    originalPrice: 59.99,
    discount: 58,
    devices: 3,
    duration: "1 Year",
    features: ["Virus Protection", "Safe Money Browser", "VPN (300MB/day)", "Privacy Protection", "Parental Controls"],
    image: "/images/products/kaspersky.png",
    popular: false
  },
  {
    id: 5,
    name: "ESET Smart Security Premium",
    description: "Advanced security solution with password manager and encryption.",
    price: 39.99,
    originalPrice: 79.99,
    discount: 50,
    devices: 5,
    duration: "1 Year",
    features: ["Antivirus", "Firewall", "Banking Protection", "Password Manager", "File Encryption"],
    image: "/images/products/eset.png",
    popular: false
  },
  {
    id: 6,
    name: "Avast Premium Security",
    description: "All-in-one protection against viruses and privacy threats.",
    price: 27.99,
    originalPrice: 69.99,
    discount: 60,
    devices: 10,
    duration: "1 Year",
    features: ["Advanced Antivirus", "Ransomware Protection", "Wi-Fi Inspector", "Real Site", "Firewall"],
    image: "/images/products/avast.png",
    popular: false
  }
];

export default function BuyAntivirusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProducts = (productsData || [])
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'popular') return product.popular;
      if (selectedFilter === 'under30') return product.price < 30;
      if (selectedFilter === 'multidevice') return product.devices > 3;
      return true;
    });

  return (
    <>
      <Head>
        <title>Antivirus License Keys | SecureKeyMaster - Genuine Software Protection</title>
        <meta name="description" content="Browse our selection of 100% authentic antivirus license keys from top brands like Norton, McAfee, and Bitdefender. Instant delivery and 24/7 support." />
        <meta name="keywords" content="antivirus license, security software, Norton, McAfee, Bitdefender, Kaspersky, ESET, Avast" />
        <meta property="og:title" content="Genuine Antivirus License Keys" />
        <meta property="og:description" content="Get authentic antivirus license keys with instant delivery and 24/7 support." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://securekeymaster.com/products" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": productsData.map((product, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": product.name,
                "description": product.description,
                "offers": {
                  "@type": "Offer",
                  "price": product.price.toString(),
                  "priceCurrency": "USD"
                }
              }
            }))
          })}
        </script>
      </Head>

      <div className="min-h-screen flex flex-col">
        <CategoryBar />

        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Genuine Antivirus License Keys</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Browse 100% authentic antivirus keys from trusted brands. Instant delivery & 24/7 support.
          </p>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === 'all' ? "default" : "outline"}
                onClick={() => setSelectedFilter('all')}
              >
                All Products
              </Button>
              <Button
                variant={selectedFilter === 'popular' ? "default" : "outline"}
                onClick={() => setSelectedFilter('popular')}
              >
                <Filter className="h-4 w-4 mr-1" /> Popular
              </Button>
              <Button
                variant={selectedFilter === 'under30' ? "default" : "outline"}
                onClick={() => setSelectedFilter('under30')}
              >
                Under $30
              </Button>
              <Button
                variant={selectedFilter === 'multidevice' ? "default" : "outline"}
                onClick={() => setSelectedFilter('multidevice')}
              >
                Multi-Device
              </Button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
