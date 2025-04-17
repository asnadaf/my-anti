import { requireAuth } from '../../lib/auth';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import LicenseKey from '../../models/LicenseKey';
import Order from '../../models/Order';
import { sendLicenseKey } from '../../lib/mailer';
import crypto from 'crypto';
import { createPaymentSession } from '../../lib/cashfree';
import { updateOrderStatus } from '../../lib/db';

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
    const { items, amount, shippingInfo, paymentMethod, confirmOrder } = req.body;

    console.log('Received checkout request:', { amount, items, paymentMethod }); // Debug log

    // Validate required fields
    if (amount === undefined || amount === null || amount === '') {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required (must be a positive number)'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required'
      });
    }

    if (!shippingInfo || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.name) {
      return res.status(400).json({
        success: false,
        message: 'Shipping information is incomplete'
      });
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
          price: itemPrice,
          name: product.name
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
    
    // Generate a unique order ID with prefix
    const randomId = crypto.randomBytes(4).toString('hex');
    const orderId = `secure-key-ord-${randomId}-${Date.now()}`;

    // Create order with or without user
    const orderData = {
      orderId, // Custom order ID for tracking
      items: orderItems,
      total,
      status: paymentMethod === 'ccavenue' ? 'pending' : 'completed', // Set status based on payment method
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: paymentMethod === 'ccavenue' ? 'pending' : 'paid', // Set payment status based on payment method
      shippingAddress: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        phone: shippingInfo.phone
      }
    };

    // Add user if authenticated
    if (auth && auth.userId) {
      orderData.user = auth.userId;
    }

    const order = await Order.create(orderData);

    // If payment method is Cashfree, create payment session
    if (paymentMethod === 'cashfree' && confirmOrder) {
      console.log('Creating Cashfree payment session with amount:', parsedAmount); // Debug log
      
      const paymentSession = await createPaymentSession({
        orderId,
        amount: parsedAmount,
        customerDetails: shippingInfo
      });

      return res.status(200).json({
        success: true,
        orderId,
        paymentUrl: paymentSession.payment_link
      });
    }

    // For non-CCAvenue and non-Cashfree payments, process the order immediately
    if (paymentMethod !== 'ccavenue' && paymentMethod !== 'cashfree') {
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
          key.order = order._id;
          await key.save();
          licenseKeys.push(key.key);
        }
        
        // Decrease product stock count
        product.stockCount -= item.quantity;
        await product.save();
      }

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
    } else {
      // For CCAvenue payments, just return the order ID
      return res.status(200).json({
        message: 'Order created successfully, awaiting payment',
        orderId: order._id,
        customOrderId: orderId,
        total,
        processedItems: availableItems,
        skippedItems: unavailableItems
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process checkout'
    });
  }
} 