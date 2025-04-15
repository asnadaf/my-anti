import { ProductsContent } from "@/pages/buyantivirus/ProductsContent";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products | SecureKeyMaster',
  description: 'Browse our selection of antivirus and security software licenses. Find the perfect protection for your needs.',
};

export default function ProductsPage() {
  return <ProductsContent />;
} 