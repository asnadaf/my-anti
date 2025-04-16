import dbConnect from '../../lib/db';
import { fetchFilteredProducts, fetchTopProduct } from '../../lib/products';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();
    
    // Extract query parameters
    const { 
      security, 
      brand, 
      duration, 
      minPrice, 
      maxPrice, 
      sortBy = 'relevance',
      page = '1'
    } = req.query;
    
    // Get filtered products
    const result = await fetchFilteredProducts({
      security,
      brand,
      duration,
      minPrice,
      maxPrice,
      sortBy,
      page: parseInt(page, 10) || 1,
      limit: 12
    });
    
    // Get top product if requested
    let topProduct = null;
    if (req.query.includeTop === 'true') {
      topProduct = await fetchTopProduct();
    }
    
    // Return combined result
    return res.status(200).json({
      ...result,
      topProduct,
      success: true
    });
  } catch (error) {
    console.error('API products error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch products',
      products: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      pageSize: 12
    });
  }
} 