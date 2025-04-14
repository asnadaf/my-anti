import dbConnect from '../../lib/db';
import Product from '../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q, category, sort, page = 1, limit = 10 } = req.query;

  try {
    await dbConnect();

    // Build search query
    const query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    // Build sort options
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split('-');
      sortOptions[field] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Execute search
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return res.status(200).json({
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Error performing search' });
  }
} 