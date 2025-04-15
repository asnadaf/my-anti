"use client";

import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { LoginContent } from "@/components/pages/LoginContent";

export function LoginWrapper() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <LoginContent />
      </main>
      <Footer />
    </div>
  );
} 