import { requireAuth, requireRole } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import LicenseKey from '../../../../models/LicenseKey';
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
        const keys = await LicenseKey.find({}).populate('product').lean();
        return res.status(200).json(keys);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching license keys' });
      }

    case 'POST':
      try {
        const { key, product, status } = req.body;
        
        if (!key || !product) {
          return res.status(400).json({ message: 'Key and product are required' });
        }

        // Verify product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
          return res.status(400).json({ message: 'Product not found' });
        }

        const licenseKey = await LicenseKey.create({
          key,
          product,
          status: status || 'available',
        });

        return res.status(201).json(licenseKey);
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ message: 'License key already exists' });
        }
        return res.status(500).json({ message: 'Error creating license key' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 