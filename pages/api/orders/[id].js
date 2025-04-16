import { requireAuth } from '../../../utils/auth';
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import LicenseKey from '../../../models/LicenseKey';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();

    // Get user from session
    const user = await requireAuth(req, res);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get order ID from URL
    const { id } = req.query;

    // Find order and populate product details
    const order = await Order.findById(id)
      .populate('items.product', 'name')
      .lean();

    // Check if order exists and belongs to user
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find license keys for this order
    const licenseKeys = await LicenseKey.find({ order: id })
      .select('key')
      .lean();

    // Return order details and license keys
    return res.status(200).json({
      order,
      licenseKeys: licenseKeys.map(lk => lk.key)
    });

  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 