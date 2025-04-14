import { requireAuth } from '@lib/auth';
import dbConnect from '@lib/db';
import Category from '@models/Category';
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

    const { name, description, status, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    await dbConnect();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = new Category({
      name,
      description,
      status: status || 'active',
      image,
      slug
    });

    await category.save();

    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 