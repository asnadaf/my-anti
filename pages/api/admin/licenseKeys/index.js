import { NextResponse } from 'next/server';
import dbConnect from '@lib/db';
import LicenseKey from '@models/LicenseKey';
import { requireAuth } from '@lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await requireAuth(req, res);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { key, status, product } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'License key is required' });
    }

    if (!product) {
      return res.status(400).json({ message: 'Product is required' });
    }

    await dbConnect();

    // Check if license key already exists
    const existingKey = await LicenseKey.findOne({ key });
    if (existingKey) {
      return res.status(400).json({ message: 'License key already exists' });
    }

    const licenseKey = await LicenseKey.create({
      key,
      status: status || 'active',
      product,
    });

    return res.status(201).json(licenseKey);
  } catch (error) {
    console.error('Error creating license key:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 