"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about", description: "Learn about our company" },
      { name: "Careers", href: "/careers", description: "Join our team" },
      { name: "Blog", href: "/blog", description: "Read our latest articles" },
    ],
    products: [
      { name: "All Products", href: "/products", description: "Browse all antivirus products" },
      { name: "Popular Products", href: "/products?filter=popular", description: "View our most popular products" },
      { name: "New Arrivals", href: "/products?filter=new", description: "Check out our latest products" },
    ],
    support: [
      { name: "Help Center", href: "/help", description: "Get help and support" },
      { name: "Contact Us", href: "/contact", description: "Reach out to our team" },
      { name: "FAQs", href: "/faq", description: "Find answers to common questions" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy", description: "Read our privacy policy" },
      { name: "Terms of Service", href: "/terms", description: "View our terms of service" },
      { name: "Cookie Policy", href: "/cookies", description: "Learn about our cookie usage" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/securekeymaster" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/securekeymaster" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/securekeymaster" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/securekeymaster" },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">SecureKeyMaster</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Your trusted source for genuine software license keys with 24/7 support and instant delivery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                    aria-label={link.description}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                    aria-label={link.description}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                    aria-label={link.description}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors"
                    aria-label={link.description}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-800 mt-12 pt-8 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; {currentYear} SecureKeyMaster. All rights reserved.</p>
          <p className="mt-2 text-sm">
            SecureKeyMaster is not affiliated with or endorsed by any of the software companies whose products we sell.
          </p>
        </div>
      </div>
    </footer>
  );
} 