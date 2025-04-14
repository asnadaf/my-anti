import { requireAuth, requireRole } from '../../../../../lib/auth';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';

export default async function handler(req, res) {
  const auth = await requireAuth(req, res);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const roleCheck = await requireRole(['admin'])(req, res);
  if (!roleCheck) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id).populate('category').lean();
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching product' });
      }

    case 'PUT':
      try {
        const { name, description, price, category, slug, stock } = req.body;
        
        if (!name || !slug || !price || !category) {
          return res.status(400).json({ message: 'Name, slug, price, and category are required' });
        }

        const product = await Product.findByIdAndUpdate(
          id,
          { name, description, price, category, slug, stock },
          { new: true, runValidators: true }
        ).populate('category').lean();

        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: 'Product with this slug already exists' });
        }
        return res.status(500).json({ message: 'Error updating product' });
      }

    case 'DELETE':
      try {
        const product = await Product.findByIdAndDelete(id).lean();
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting product' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 