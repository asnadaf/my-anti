import { seedDatabase } from '../../lib/seed';

/**
 * API endpoint to seed the database with sample data
 * WARNING: This should be disabled in production
 */
export default async function handler(req, res) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false, 
      message: 'This endpoint is only available in development environment' 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Get the authorization key from request headers
    const authKey = req.headers.authorization;
    
    // Check if authorization key matches the one in environment variables
    if (!authKey || authKey !== process.env.SEED_AUTH_KEY) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized. Invalid or missing authorization key.' 
      });
    }

    // Call the seedDatabase function
    const result = await seedDatabase();
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Database seeded successfully',
      data: {
        categoriesCount: result.categories.length,
        durationsCount: result.durations.length,
        productsCount: result.products.length,
        licenseKeysCount: result.licenseKeys.length
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      message: 'Error seeding database',
      error: error.message
    });
  }
} 