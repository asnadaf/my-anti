import { requireAuth } from '@lib/auth';
import dbConnect from '@lib/db';
import Product from '@models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = await requireAuth(req, res);
    if (!auth || auth.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, description, price, category, status, image, features } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    await dbConnect();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      status: status || 'active',
      image,
      features: features ? features.filter(f => f.trim()) : [],
      slug
    });

    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 