import { requireAdmin } from '@lib/auth';
import dbConnect from '@lib/db';
import Product from '@models/Product';
import Duration from '@models/Duration';
import { invalidateProductCache } from '../../../../lib/cache';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!['PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate and check for admin role (pass isApi=true)
    const admin = await requireAdmin({ req, res }, null, true);
    
    // If not admin, the function already sends the appropriate response
    if (!admin) {
      return;
    }

    await dbConnect();

    if (req.method === 'PUT') {
      const { 
        name, 
        description, 
        originalPrice, 
        discountPrice, 
        category, 
        status, 
        image, 
        features, 
        stockCount, 
        duration, 
        tag,
        securityFeature,
        brand
      } = req.body;

      if (!name || !description || !originalPrice || !category || !securityFeature || !brand) {
        return res.status(400).json({ 
          message: 'Name, description, original price, category, security feature, and brand are required' 
        });
      }

      // Generate new slug if name has changed
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const updateData = {
        name,
        description,
        originalPrice: parseFloat(originalPrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        status: status || 'active',
        image: image || '',
        features: Array.isArray(features) ? features.filter(f => f && f.trim()) : [],
        stockCount: parseInt(stockCount) || 0,
        duration: duration || null,
        tag: tag || 'None',
        slug: newSlug,
        securityFeature,
        brand
      };

      // Validate duration if provided
      if (duration) {
        const durationExists = await Duration.findById(duration);
        if (!durationExists) {
          return res.status(400).json({ message: 'Invalid duration selected' });
        }
      }

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Invalidate product cache
      invalidateProductCache();
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Invalidate product cache
      invalidateProductCache();
      return res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (error) {
    console.error('Error handling product:', error);
    return res.status(500).json({ message: 'Internal server error', details: error.message });
  }
} 