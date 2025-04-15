"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "../../../lib/utils";
import { Shield, Home, Laptop, Building2, Users, Globe, Server, Smartphone, Database } from 'lucide-react';
import { Button } from "../../../components/ui/button";

// Define the Category interface
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface CategoryBarProps {
  categories?: Category[];
}

// Default categories if none are provided
const defaultCategories = [
  { name: "All Products", icon: Home, href: "/buyantivirus/products" },
  { name: "Antivirus", icon: Shield, href: "/buyantivirus/products?category=antivirus" },
  { name: "Internet Security", icon: Globe, href: "/buyantivirus/products?category=internet-security" },
  { name: "Total Security", icon: Server, href: "/buyantivirus/products?category=total-security" },
  { name: "Mobile Security", icon: Smartphone, href: "/buyantivirus/products?category=mobile-security" },
  { name: "Business Security", icon: Building2, href: "/buyantivirus/products?category=business-security" },
  { name: "Family Protection", icon: Users, href: "/buyantivirus/products?category=family-protection" },
  { name: "Data Protection", icon: Database, href: "/buyantivirus/products?category=data-protection" },
];

// Icon mapping for categories
const iconMap: Record<string, React.ElementType> = {
  "All Products": Home,
  "Antivirus": Shield,
  "Internet Security": Globe,
  "Total Security": Server,
  "Mobile Security": Smartphone,
  "Business Security": Building2,
  "Family Protection": Users,
  "Data Protection": Database,
  // Default icon for any other category
  "default": Shield
};

const CategoryBar: React.FC<CategoryBarProps> = ({ categories = [] }) => {
  const pathname = usePathname();
  
  // Use server-provided categories if available, otherwise use defaults
  const displayCategories = categories.length > 0 
    ? categories.map(category => ({
        name: category.name,
        icon: iconMap[category.name] || iconMap.default,
        href: `/buyantivirus/products?category=${category.slug}`
      }))
    : defaultCategories;

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {displayCategories.map((category) => {
            const Icon = category.icon;
            const isActive = pathname === category.href || 
                            (pathname?.startsWith('/buyantivirus/products') && 
                             new URLSearchParams(window.location.search).get('category') === category.href.split('=')[1]);
            
            return (
              <Link key={category.name} href={category.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center space-x-1 whitespace-nowrap",
                    isActive && "bg-blue-50 text-blue-600 font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar; 