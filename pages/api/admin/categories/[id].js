import { requireAuth } from '@lib/auth';
import dbConnect from '@lib/db';
import Category from '@models/Category';
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
      const { name, description, status, image } = req.body;

      if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const category = await Category.findByIdAndUpdate(
        id,
        {
          name,
          description,
          status,
          image,
          slug
        },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json(category);
    }

    if (req.method === 'DELETE') {
      // Check if category has any products
      const productCount = await Product.countDocuments({ category: id });
      if (productCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete category with existing products. Please delete or move the products first.' 
        });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error handling category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 