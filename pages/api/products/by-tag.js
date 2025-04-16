import dbConnect from '@lib/db';
import Product from '@models/Product';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { tag } = req.query;

    if (!tag) {
      return res.status(400).json({ message: 'Tag parameter is required' });
    }

    const products = await Product.find({ tag })
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 