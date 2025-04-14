import { requireAuth } from '../../lib/auth';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import LicenseKey from '../../models/LicenseKey';
import Order from '../../models/Order';
import { sendLicenseKey } from '../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const auth = await requireAuth(req, res);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  await dbConnect();

  try {
    const { productId, quantity = 1, email, phone } = req.body;

    if (!productId || !email) {
      return res.status(400).json({ message: 'Product ID and email are required' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find available license keys
    const availableKeys = await LicenseKey.find({
      product: productId,
      status: 'available',
    }).limit(quantity);

    if (availableKeys.length < quantity) {
      return res.status(400).json({ message: 'Insufficient license keys available' });
    }

    // Create order
    const order = await Order.create({
      user: auth.userId,
      product: productId,
      quantity,
      total: product.price * quantity,
      status: 'completed',
    });

    // Update license keys and send them
    const licenseKeys = [];
    for (const key of availableKeys) {
      key.status = 'sold';
      key.order = order._id;
      key.soldAt = new Date();
      await key.save();
      licenseKeys.push(key.key);
    }

    // Send license keys via email and SMS
    const deliveryResult = await sendLicenseKey({
      email,
      phone,
      licenseKey: licenseKeys.join('\n'),
      productName: product.name,
    });

    return res.status(200).json({
      message: 'Order completed successfully',
      orderId: order._id,
      deliveryResult,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: 'Error processing checkout' });
  }
} 