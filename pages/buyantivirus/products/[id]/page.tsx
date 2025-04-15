import { ProductDetails } from "@/pages/buyantivirus/ProductDetails";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Details | SecureKeyMaster',
  description: 'View detailed information about our antivirus licenses, including features, pricing, and specifications.',
};

export default function ProductDetailsPage() {
  return <ProductDetails />;
} 