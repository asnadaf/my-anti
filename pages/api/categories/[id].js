import { requireAuth, requireRole } from '@lib/auth';
import dbConnect from '@lib/db';
import Category from '@models/Category';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    await dbConnect();

    switch (method) {
      case 'GET':
        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);

      case 'PUT':
        // Require admin role for PUT
        await requireAuth(req, res);
        await requireRole(['admin'])(req, res);

        const { name, description, slug } = req.body;

        if (!name || !slug) {
          return res.status(400).json({ message: 'Name and slug are required' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { name, description, slug },
          { new: true, runValidators: true }
        );

        if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(updatedCategory);

      case 'DELETE':
        // Require admin role for DELETE
        await requireAuth(req, res);
        await requireRole(['admin'])(req, res);

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
          return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Category API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 