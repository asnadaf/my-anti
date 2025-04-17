import dbConnect from './db';
import Product from '../models/Product';
import Duration from '../models/Duration';
import Category from '../models/Category';

export async function fetchProducts({ tag, limit = 10 } = {}) {
  try {
    await dbConnect();
    
    const query = {};
    if (tag) {
      query.tag = tag;
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      products: JSON.parse(JSON.stringify(products))
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

export async function fetchTopProduct() {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ tag: 'Top' })
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .lean();

    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error('Error fetching top product:', error);
    return null;
  }
}

export async function fetchFeaturedProducts() {
  try {
    await dbConnect();
    
    const products = await Product.find({ tag: 'Featured' })
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug) {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ slug })
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .lean();

    if (!product) {
      return null;
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Fetch products with filtering and sorting options
 * @param {Object} options - Filter and sort options
 * @returns {Object} - Filtered products and total count
 */
export async function fetchFilteredProducts(options = {}) {
  // Check if we're running in the browser
  const isServer = typeof window === 'undefined';
  
  try {
    // Connect to the database
    try {
      await dbConnect();
      
      // In browser, we skip the actual DB connection but still need to log
      if (isServer) {
        console.log('Connected to MongoDB');
      } else {
        console.log('Browser environment - using client-side data fetching');
      }
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed: ' + dbError.message);
    }
    
    const {
      security,
      brand,
      duration,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = options;
    
    console.log('Filter options received:', { security, brand, duration, minPrice, maxPrice, sortBy, page });
    
    // If we're on the client side, we should rely on the data we got from SSR
    // or make an API call instead of trying to use mongoose directly
    if (!isServer) {
      console.log('Client-side filtering not supported directly. Using fallback or API.');
      return { 
        products: [], 
        totalCount: 0, 
        currentPage: 1,
        totalPages: 0,
        pageSize: 12,
        error: 'Client-side DB access not supported' 
      };
    }
    
    // Server-side DB access continues below
    // Build query filter
    const filter = {}; // Start with empty filter
    
    // Security feature filter - maps to securityFeature field
    if (security) {
      const securityFeatures = security.split(',');
      if (securityFeatures.length > 0) {
        // Convert IDs to proper format expected by DB
        const formattedFeatures = securityFeatures.map(s => {
          // Convert from URL format (antivirus) to model format (Antivirus)
          return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
        });
        console.log('Formatted security features:', formattedFeatures);
        filter.securityFeature = { $in: formattedFeatures };
      }
    }
    
    // Brand filter
    if (brand) {
      const brands = brand.split(',');
      if (brands.length > 0) {
        // Convert IDs to proper format expected by DB
        const formattedBrands = brands.map(b => {
          // Handle special cases for capitalization
          if (b.toLowerCase() === 'avast' || b.toLowerCase() === 'avg' || b.toLowerCase() === 'eset') {
            return b.toUpperCase();
          }
          // Otherwise capitalize first letter
          return b.charAt(0).toUpperCase() + b.slice(1);
        });
        console.log('Formatted brands:', formattedBrands);
        filter.brand = { $in: formattedBrands };
      }
    }
    
    // Duration filter
    if (duration) {
      try {
        const durationIds = duration.split(',');
        if (durationIds.length > 0) {
          console.log('Duration IDs from URL:', durationIds);
          
          // Get all durations from the database
          const durationDocs = await Duration.find({}).lean();
          console.log('Available durations in DB:', durationDocs);
          
          if (durationDocs && durationDocs.length > 0) {
            // Map the URL-friendly IDs to actual Duration ObjectIds
            const matchedDurationIds = durationDocs
              .filter(doc => {
                // Create a string that matches our URL format: "{deviceCount}pc-{durationValue}{durationUnit}"
                const docStr = `${doc.deviceCount}pc-${doc.duration}${doc.durationUnit.toLowerCase()}`;
                console.log(`Comparing duration ${docStr} with filter options`);
                
                // Check if any of our filter values match this duration
                return durationIds.some(id => {
                  const match = docStr.includes(id.toLowerCase());
                  if (match) console.log(`Found match: ${docStr} matches ${id}`);
                  return match;
                });
              })
              .map(doc => doc._id);
            
            console.log('Matched duration IDs:', matchedDurationIds);
            
            if (matchedDurationIds.length > 0) {
              filter.duration = { $in: matchedDurationIds };
            }
          }
        }
      } catch (durationErr) {
        console.error('Error processing duration filter:', durationErr);
        // Continue with other filters even if duration fails
      }
    }
    
    // Price range filter
    if (minPrice !== undefined && minPrice !== '') {
      filter.discountPrice = { ...filter.discountPrice, $gte: Number(minPrice) };
    }
    
    if (maxPrice !== undefined && maxPrice !== '') {
      filter.discountPrice = { ...filter.discountPrice, $lte: Number(maxPrice) };
    }
    
    console.log('Final query filter:', filter);
    
    // Set up sorting
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { discountPrice: 1 };
        break;
      case 'price-high':
        sort = { discountPrice: -1 };
        break;
      case 'name-asc':
        sort = { name: 1 };
        break;
      case 'name-desc':
        sort = { name: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default: // relevance - use a combination of featured tag and created date
        sort = { tag: -1, createdAt: -1 };
        break;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Query products with filters, sorting, and pagination
    let products = [];
    let totalCount = 0;
    
    try {
      const productsQuery = Product.find(filter)
        .populate('category', 'name')
        .populate('duration')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
        
      // Execute query
      products = await productsQuery;
      
      // Count total matching products for pagination
      totalCount = await Product.countDocuments(filter);
      
      console.log(`Found ${products.length} products out of ${totalCount} total matching products`);
      console.log(`Page ${page}, showing ${skip+1}-${Math.min(skip+limit, totalCount)} of ${totalCount}`);
    } catch (queryError) {
      console.error('Error executing product query:', queryError);
      throw new Error('Failed to query products: ' + queryError.message);
    }
    
    return {
      products: JSON.parse(JSON.stringify(products)),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      pageSize: limit
    };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    // Return empty but valid result structure to prevent UI errors
    return { 
      products: [], 
      totalCount: 0, 
      currentPage: 1, 
      totalPages: 0, 
      pageSize: 12,
      error: error.message 
    };
  }
}