import { requireAuth } from '@lib/auth';
import dbConnect from '@lib/db';
import Product from '@models/Product';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = await requireAuth(req, res);
    if (!auth || auth.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    if (req.method === 'PUT') {
      const { name, description, price, category, status, image, features } = req.body;

      if (!name || !description || !price || !category) {
        return res.status(400).json({ message: 'Name, description, price, and category are required' });
      }

      // Generate new slug if name has changed
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const updateData = {
        name,
        description,
        price: parseFloat(price),
        category,
        status: status || 'active',
        image: image || '',
        features: Array.isArray(features) ? features.filter(f => f && f.trim()) : [],
        slug: newSlug
      };

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Error handling product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 