import { requireAuth } from '../../lib/auth';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import LicenseKey from '../../models/LicenseKey';
import Order from '../../models/Order';
import { sendLicenseKey } from '../../lib/mailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Try to get auth, but don't require it
  let auth = null;
  try {
    auth = await requireAuth(req, res);
  } catch (error) {
    // Auth is optional, continue without it
    console.log('No authenticated user, proceeding as guest');
  }

  await dbConnect();

  try {
    const { items, shippingInfo, paymentInfo, confirmOrder } = req.body;

    if (!items || !items.length || !shippingInfo || !shippingInfo.email) {
      return res.status(400).json({ message: 'Cart items and shipping information are required' });
    }

    // First check: Validate all items and check stock availability
    const availabilityCheck = [];
    let total = 0;
    const orderItems = [];
    const licenseKeys = [];

    // Process each item in the cart to check availability
    for (const item of items) {
      // Find the product
      const product = await Product.findById(item.id);
      if (!product) {
        availabilityCheck.push({
          id: item.id,
          name: item.name,
          available: false,
          message: 'Product not found'
        });
        continue;
      }

      // Check if product has enough stock
      const hasEnoughStock = product.stockCount >= item.quantity;
      
      // Find available license keys
      const availableKeys = await LicenseKey.find({
        product: item.id,
        sold: false,
      }).limit(item.quantity);
      
      const hasEnoughKeys = availableKeys.length >= item.quantity;
      
      // Calculate item total
      const itemPrice = product.discountPrice || product.originalPrice;
      const itemTotal = itemPrice * item.quantity;
      
      // Add to availability check
      availabilityCheck.push({
        id: item.id,
        name: item.name,
        requested: item.quantity,
        available: hasEnoughStock && hasEnoughKeys,
        inStock: product.stockCount,
        availableKeys: availableKeys.length,
        price: itemPrice,
        total: itemTotal
      });
      
      // If item is available, add to totals
      if (hasEnoughStock && hasEnoughKeys) {
        total += itemTotal;
        orderItems.push({
          product: item.id,
          quantity: item.quantity,
          price: itemPrice
        });
      }
    }
    
    // Check if any items are available
    const availableItems = availabilityCheck.filter(item => item.available);
    const unavailableItems = availabilityCheck.filter(item => !item.available);
    
    // If this is just a check (not confirming the order)
    if (!confirmOrder) {
      return res.status(200).json({
        message: 'Availability check completed',
        availableItems,
        unavailableItems,
        total,
        canProceed: availableItems.length > 0
      });
    }
    
    // If confirming order but no available items
    if (availableItems.length === 0) {
      return res.status(400).json({ 
        message: 'No items available to purchase',
        unavailableItems
      });
    }
    
    // Process the order with available items
    for (const item of orderItems) {
      // Find the product
      const product = await Product.findById(item.product);
      
      // Find available license keys
      const availableKeys = await LicenseKey.find({
        product: item.product,
        sold: false,
      }).limit(item.quantity);
      
      // Mark license keys as sold and add to list
      for (const key of availableKeys) {
        key.sold = true;
        key.order = null; // Will be updated after order creation
        await key.save();
        licenseKeys.push(key.key);
      }
      
      // Decrease product stock count
      product.stockCount -= item.quantity;
      await product.save();
    }

    // Generate a unique order ID with prefix
    const randomId = crypto.randomBytes(4).toString('hex');
    const orderId = `secure-key-ord-${randomId}-${Date.now()}`;

    // Create order with or without user
    const orderData = {
      orderId, // Custom order ID for tracking
      items: orderItems,
      total,
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      shippingAddress: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode
      }
    };

    // Add user if authenticated
    if (auth && auth.userId) {
      orderData.user = auth.userId;
    }

    const order = await Order.create(orderData);

    // Update license keys with order ID
    await LicenseKey.updateMany(
      { key: { $in: licenseKeys } },
      { $set: { order: order._id } }
    );

    // Send license keys via email
    const deliveryResult = await sendLicenseKey({
      email: shippingInfo.email,
      licenseKey: licenseKeys.join('\n'),
      productName: availableItems.map(item => item.name).join(', '),
      orderId: orderId // Include the custom order ID in the email
    });

    return res.status(200).json({
      message: 'Order completed successfully',
      orderId: order._id,
      customOrderId: orderId, // Return the custom order ID to the client
      deliveryResult,
      processedItems: availableItems,
      skippedItems: unavailableItems
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ message: 'Error processing checkout' });
  }
} 