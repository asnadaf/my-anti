import { requireAuth, requireRole } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';

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

  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find({}).populate('category').lean();
        return res.status(200).json(products);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching products' });
      }

    case 'POST':
      try {
        const { name, description, price, category, slug, stock } = req.body;
        
        if (!name || !slug || !price || !category) {
          return res.status(400).json({ message: 'Name, slug, price, and category are required' });
        }

        const product = await Product.create({
          name,
          description,
          price,
          category,
          slug,
          stock: stock || 0,
        });

        return res.status(201).json(product);
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: 'Product with this slug already exists' });
        }
        return res.status(500).json({ message: 'Error creating product' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 