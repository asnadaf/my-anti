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

export async function fetchTopProduct() {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ tag: 'Top' })
      .populate('category', 'name')
      .lean();

    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error('Error fetching top product:', error);
    return null;
  }
}

export async function fetchFeaturedProducts() {
  try {
    await dbConnect();
    
    const products = await Product.find({ tag: 'Featured' })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching featured products:', error);
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