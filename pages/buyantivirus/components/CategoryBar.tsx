"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@lib/utils";
import { Shield, Home, Laptop, Building2, Users, Globe, Server } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Smartphone, Database } from "lucide-react";

type Category = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const categories: Category[] = [
  {
    name: 'Home Antivirus',
    icon: Home,
    href: '/products/home-antivirus'
  },
  {
    name: 'Personal Security',
    icon: Shield,
    href: '/products/personal-security'
  },
  {
    name: 'Business Solutions',
    icon: Building2,
    href: '/products/business'
  },
  {
    name: 'Enterprise Security',
    icon: Server,
    href: '/products/enterprise'
  },
  {
    name: 'Multi-Device',
    icon: Laptop,
    href: '/products/multi-device'
  },
  {
    name: 'Family Protection',
    icon: Users,
    href: '/products/family'
  },
  {
    name: 'Internet Security',
    icon: Globe,
    href: '/products/internet-security'
  }
];

export function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto">
          <div className="flex space-x-1 py-2 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = pathname === category.href;
              
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    "hover:bg-security-lightBlue hover:text-security-blue",
                    "focus:outline-none focus:ring-2 focus:ring-security-blue focus:ring-offset-2",
                    isActive
                      ? "bg-security-blue text-white hover:bg-security-blue/90 hover:text-white"
                      : "text-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 