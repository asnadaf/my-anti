import { AboutPage } from "@/pages/buyantivirus/AboutPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SecureKeyMaster',
  description: 'Learn about SecureKeyMaster. We\'re dedicated to providing authentic antivirus license keys at the best prices with exceptional customer service.',
};

export default function Page() {
  return <AboutPage />;
} 