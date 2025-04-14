import { requireAuth, requireRole } from '../../../lib/auth';
import dbConnect from '../../../lib/db';
import Category from '../../../models/Category';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await dbConnect();

    switch (method) {
      case 'GET':
        const categories = await Category.find({}).sort({ name: 1 });
        return res.status(200).json(categories);

      case 'POST':
        // Require admin role for POST
        await requireAuth(req, res);
        await requireRole(['admin'])(req, res);

        const { name, description, slug } = req.body;

        if (!name || !slug) {
          return res.status(400).json({ message: 'Name and slug are required' });
        }

        const category = await Category.create({
          name,
          description,
          slug,
        });

        return res.status(201).json(category);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Protect POST route with admin middleware
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Apply admin middleware to POST route
export const post = requireAdmin(handler); 