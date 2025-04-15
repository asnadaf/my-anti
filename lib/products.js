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

export async function fetchProductBySlug(slug) {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ slug })
      .populate('category', 'name')
      .lean();

    if (!product) {
      return null;
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}