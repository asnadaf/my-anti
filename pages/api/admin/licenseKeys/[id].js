import { NextResponse } from 'next/server';
import dbConnect from '@lib/db';
import LicenseKey from '@models/LicenseKey';
import Product from '@models/Product';
import { requireAuth } from '@lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'License key ID is required' });
  }

  try {
    const user = await requireAuth(req, res);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const licenseKey = await LicenseKey.findById(id);
    if (!licenseKey) {
      return res.status(404).json({ message: 'License key not found' });
    }

    if (req.method === 'PUT') {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      licenseKey.status = status;
      await licenseKey.save();

      return res.status(200).json(licenseKey);
    } else if (req.method === 'DELETE') {
      // Find the product to update its stock count
      const productDoc = await Product.findById(licenseKey.product);
      if (productDoc) {
        // Decrease product stock count
        productDoc.stockCount = Math.max(0, productDoc.stockCount - 1);
        await productDoc.save();
      }

      await licenseKey.deleteOne();
      return res.status(200).json({ message: 'License key deleted successfully' });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling license key:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 