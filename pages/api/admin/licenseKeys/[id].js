import { NextResponse } from 'next/server';
import dbConnect from '@lib/db';
import LicenseKey from '@models/LicenseKey';
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

    if (req.method === 'PUT') {
      const { key, status, product, duration } = req.body;

      if (!key) {
        return res.status(400).json({ message: 'License key is required' });
      }

      if (!product) {
        return res.status(400).json({ message: 'Product is required' });
      }

      if (!duration) {
        return res.status(400).json({ message: 'Duration is required' });
      }

      // Check if the new key already exists (excluding current key)
      const existingKey = await LicenseKey.findOne({ key, _id: { $ne: id } });
      if (existingKey) {
        return res.status(400).json({ message: 'License key already exists' });
      }

      const updatedLicenseKey = await LicenseKey.findByIdAndUpdate(
        id,
        { key, status, product, duration },
        { new: true }
      );

      if (!updatedLicenseKey) {
        return res.status(404).json({ message: 'License key not found' });
      }

      return res.status(200).json(updatedLicenseKey);
    }

    if (req.method === 'DELETE') {
      const deletedLicenseKey = await LicenseKey.findByIdAndDelete(id);

      if (!deletedLicenseKey) {
        return res.status(404).json({ message: 'License key not found' });
      }

      return res.status(200).json({ message: 'License key deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling license key:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 