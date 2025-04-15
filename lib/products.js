import dbConnect from './db';
import Product from '../models/Product';

export async function fetchProducts() {
  try {
    await dbConnect();
    
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
} 