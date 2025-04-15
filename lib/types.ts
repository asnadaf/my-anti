export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  duration: string;
  devices: number;
  image?: string;
  features: string[];
  rating?: number;
  reviews?: number;
} 