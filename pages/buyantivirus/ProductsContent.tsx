"use client";

import React from 'react';
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import ProductCard from "./components/ProductCard";
import { Button } from "../../components/ui/button";
import { Filter, Search } from 'lucide-react';
import { Input } from "../../components/ui/input";
import CategoryBar from "./components/CategoryBar";
import Head from 'next/head';

// Move this to a separate API route or data file
const productsData = [
  {
    id: 1,
    name: "Norton 360 Deluxe",
    description: "Complete protection for up to 5 devices with secure VPN and dark web monitoring.",
    discountPrice: 29.99,
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
    discountPrice: 34.99,
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
    discountPrice: 32.99,
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
    discountPrice: 24.99,
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
    discountPrice: 39.99,
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
    discountPrice: 27.99,
    originalPrice: 69.99,
    discount: 60,
    devices: 10,
    duration: "1 Year",
    features: ["Advanced Antivirus", "Ransomware Protection", "Wi-Fi Inspector", "Real Site", "Firewall"],
    image: "/images/products/avast.png",
    popular: false
  }
];

interface ProductsContentProps {
  productsData: Array<{
    id: number;
    name: string;
    description: string;
    discountPrice: number;
    originalPrice: number;
    discount: number;
    devices: number;
    duration: string;
    features: string[];
    image: string;
    popular: boolean;
  }>;
}

const ProductsContent: React.FC<ProductsContentProps> = ({ productsData }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('all');

  const filteredProducts = productsData
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'popular') return product.popular;
      if (selectedFilter === 'under30') return product.discountPrice < 30;
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
                  "price": product.discountPrice.toString(),
                  "priceCurrency": "USD"
                }
              }
            }))
          })}
        </script>
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <CategoryBar />
        
        {/* Hero section with gradient background */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12" aria-label="Products Hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Genuine Antivirus License Keys
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Browse our selection of 100% authentic license keys for top antivirus brands
              with instant delivery and 24/7 support.
            </p>
          </div>
        </section>

        {/* Main content section with white background */}
        <section className="container mx-auto px-4 py-12" aria-label="Products List">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
            </div>
            
            <div className="flex flex-wrap gap-2" role="group" aria-label="Product filters">
              <Button 
                variant={selectedFilter === 'all' ? "default" : "outline"}
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' ? "bg-blue-600" : ""}
                aria-pressed={selectedFilter === 'all'}
              >
                All Products
              </Button>
              <Button 
                variant={selectedFilter === 'popular' ? "default" : "outline"}
                onClick={() => setSelectedFilter('popular')}
                className={selectedFilter === 'popular' ? "bg-blue-600" : ""}
                aria-pressed={selectedFilter === 'popular'}
              >
                <Filter className="h-4 w-4 mr-1" aria-hidden="true" /> Popular
              </Button>
              <Button 
                variant={selectedFilter === 'under30' ? "default" : "outline"}
                onClick={() => setSelectedFilter('under30')}
                className={selectedFilter === 'under30' ? "bg-blue-600" : ""}
                aria-pressed={selectedFilter === 'under30'}
              >
                Under $30
              </Button>
              <Button 
                variant={selectedFilter === 'multidevice' ? "default" : "outline"}
                onClick={() => setSelectedFilter('multidevice')}
                className={selectedFilter === 'multidevice' ? "bg-blue-600" : ""}
                aria-pressed={selectedFilter === 'multidevice'}
              >
                Multi-Device
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16" role="status">
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </section>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default ProductsContent; 