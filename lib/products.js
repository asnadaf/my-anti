import dbConnect from './db';
import Product from '../models/Product';
import Duration from '../models/Duration';

export async function fetchProducts() {
  try {
    await dbConnect();
    
    const products = await Product.find({})
      .populate('category', 'name')
      .populate('duration', 'name devices period')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
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
  try {
    await dbConnect();
    
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
    
    // Build query filter
    const filter = { status: 'active' }; // Only active products
    
    // Security feature filter
    if (security) {
      const securityFeatures = security.split(',');
      if (securityFeatures.length > 0) {
        // Convert IDs to proper format expected by DB
        const formattedFeatures = securityFeatures.map(s => 
          s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        );
        filter.securityFeature = { $in: formattedFeatures };
      }
    }
    
    // Brand filter
    if (brand) {
      const brands = brand.split(',');
      if (brands.length > 0) {
        // Convert IDs to proper format expected by DB
        const formattedBrands = brands.map(b => 
          b.toUpperCase()
        );
        filter.brand = { $in: formattedBrands };
      }
    }
    
    // Duration filter
    if (duration) {
      const durationIds = duration.split(',');
      if (durationIds.length > 0) {
        // Get duration documents that match the pattern (e.g., "1PC / 1Year")
        const durationDocs = await Duration.find({});
        
        // Map the URL-friendly IDs to actual Duration ObjectIds
        const matchedDurationIds = durationDocs
          .filter(doc => {
            const docStr = `${doc.devices}pc-${doc.period.replace(' ', '').toLowerCase()}`;
            return durationIds.some(id => docStr.includes(id));
          })
          .map(doc => doc._id);
        
        if (matchedDurationIds.length > 0) {
          filter.duration = { $in: matchedDurationIds };
        }
      }
    }
    
    // Price range filter
    if (minPrice !== undefined && minPrice !== '') {
      filter.discountPrice = { ...filter.discountPrice, $gte: Number(minPrice) };
    }
    
    if (maxPrice !== undefined && maxPrice !== '') {
      filter.discountPrice = { ...filter.discountPrice, $lte: Number(maxPrice) };
    }
    
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
    
    // Execute query
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .populate('duration', 'name devices period')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    return {
      products: JSON.parse(JSON.stringify(products)),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    return { products: [], totalCount: 0, currentPage: 1, totalPages: 0 };
  }
}