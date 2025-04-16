import { withAdminAuth } from '@lib/auth';
import dbConnect from '@lib/db';
import Product from '@models/Product';
import Category from '@models/Category';
import Duration from '@models/Duration';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Previous admin check is now handled by withAdminAuth
    
    const { name, description, originalPrice, discountPrice, category, status, image, features, stockCount, duration, tag } = req.body;

    if (!name || !description || !originalPrice || !category) {
      return res.status(400).json({ message: 'Name, description, original price, and category are required' });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = new Product({
      name,
      description,
      originalPrice: parseFloat(originalPrice),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      category,
      status: status || 'active',
      image: image || '',
      features: features ? features.filter(f => f.trim()) : [],
      stockCount: parseInt(stockCount) || 0,
      duration: duration || null,
      tag: tag || 'None',
      slug
    });

    // Validate duration if provided
    if (duration) {
      const durationExists = await Duration.findById(duration);
      if (!durationExists) {
        return res.status(400).json({ message: 'Invalid duration selected' });
      }
    }

    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withAdminAuth(handler); 