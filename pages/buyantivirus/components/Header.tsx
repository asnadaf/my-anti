"use client";

import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { Button } from "../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../components/ui/navigation-menu";
import { User, LogIn, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { useCart } from "../../../contexts/CartContext";
import { Badge } from "../../../components/ui/badge";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount, cartItems } = useCart();
  
  // More detailed debugging
  console.log("Cart count:", getItemCount());
  console.log("Cart items:", cartItems);
  console.log("Is cart empty?", cartItems.length === 0);
  console.log("Should show count?", getItemCount() > 0);

  const navigationItems = [
    { name: "Products", href: "/products", description: "Browse our antivirus products" },
    { name: "About", href: "/about", description: "Learn about SecureKeyMaster" },
    { name: "Contact", href: "/contact", description: "Get in touch with our team" },
    { name: "Support", href: "/support", description: "Get help and support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="mr-6 flex items-center space-x-2"
            aria-label="SecureKeyMaster Home"
          >
            <span className="font-bold">SecureKeyMaster</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-6 text-sm font-medium"
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
                aria-label={item.description}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="User dashboard"
              >
                <User className="h-5 w-5" aria-hidden="true" />
                <span>{userName}</span>
              </Link>
              <Button
                variant="ghost"
                className="text-foreground hover:text-red-600 dark:hover:text-red-400"
                onClick={() => setIsLoggedIn(false)}
                aria-label="Sign out"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  aria-label="Sign in"
                >
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-security-blue hover:bg-security-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700"
                  aria-label="Register account"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
          <ModeToggle />
          <Link href="/buyantivirus/cart">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {getItemCount() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold z-10"
                >
                  {getItemCount()}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden",
          mobileMenuOpen ? "block" : "hidden",
          "absolute top-14 left-0 right-0 bg-background border-b"
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="container py-4 space-y-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={item.description}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t">
            {isLoggedIn ? (
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="User dashboard"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                  <span>{userName}</span>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-foreground hover:text-red-600 dark:hover:text-red-400"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setMobileMenuOpen(false);
                  }}
                  aria-label="Sign out"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center space-x-2"
                    aria-label="Sign in"
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-security-blue hover:bg-security-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    aria-label="Register account"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <div className="flex justify-center pt-4">
              <ModeToggle />
            </div>
            <div className="flex justify-center pt-4">
              <Link href="/buyantivirus/cart">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {getItemCount() > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold z-10"
                    >
                      {getItemCount()}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 