import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import Duration from '../../models/Duration';
import Category from '../../models/Category';

export default async function handler(req, res) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get counts of all collections
    const productsCount = await Product.countDocuments();
    const durationsCount = await Duration.countDocuments();
    const categoriesCount = await Category.countDocuments();
    
    // Get a sample of data from each collection
    const products = await Product.find().limit(5).lean();
    const durations = await Duration.find().limit(5).lean();
    const categories = await Category.find().limit(5).lean();
    
    // Return success with data
    return res.status(200).json({
      success: true,
      counts: {
        products: productsCount,
        durations: durationsCount,
        categories: categoriesCount
      },
      samples: {
        products,
        durations,
        categories
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
} 