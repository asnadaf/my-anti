import { verifyResponse } from '../../../../lib/ccavenue';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';
import { sendLicenseKey } from '../../../../lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { encResponse, order_id, tracking_id, bank_ref_no, payment_status, failure_message } = req.body;

    console.log('CCAvenue callback received:', { order_id, payment_status });

    // Verify the response from CCAvenue
    const verificationResult = verifyResponse(encResponse, order_id, null);
    
    if (!verificationResult.success) {
      console.error('CCAvenue response verification failed:', verificationResult.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed',
        details: verificationResult.message
      });
    }

    // Find the order in the database - try both orderId and _id
    let order = await Order.findOne({ orderId: order_id });
    
    // If not found by orderId, try to find by _id (which might be in merchantParam1)
    if (!order && req.body.merchant_param1) {
      order = await Order.findById(req.body.merchant_param1);
    }
    
    if (!order) {
      console.error('Order not found:', order_id);
      // Log all orders for debugging
      const allOrders = await Order.find({}, { orderId: 1, _id: 1 }).limit(10);
      console.log('Recent orders:', allOrders);
      
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Update order with payment details
    order.paymentStatus = payment_status === 'Success' ? 'paid' : 'failed';
    order.paymentDetails = {
      trackingId: tracking_id,
      bankRefNo: bank_ref_no,
      paymentStatus,
      failureMessage: failure_message,
      paymentMethod: 'ccavenue',
      paymentDate: new Date()
    };

    // If payment is successful, process the order
    if (payment_status === 'Success') {
      // Get license keys for the order
      const licenseKeys = await Order.aggregate([
        { $match: { _id: order._id } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'licensekeys',
            localField: 'items.product',
            foreignField: 'product',
            as: 'keys'
          }
        },
        { $unwind: '$keys' },
        { $match: { 'keys.sold': false } },
        { $limit: 1 },
        { $project: { key: '$keys.key' } }
      ]);

      const keys = licenseKeys.map(k => k.key);

      // Send license keys via email
      if (keys.length > 0) {
        await sendLicenseKey({
          email: order.shippingAddress.email,
          licenseKey: keys.join('\n'),
          productName: order.items.map(item => item.name).join(', '),
          orderId: order.orderId
        });
      }

      // Mark license keys as sold
      await Order.updateMany(
        { _id: order._id },
        { $set: { 'items.$[].keys.sold': true } }
      );
    }

    await order.save();

    // Redirect to success or failure page
    const redirectUrl = payment_status === 'Success'
      ? `/buyantivirus/order-confirmation?orderId=${order.orderId}`
      : `/buyantivirus/payment-failed?orderId=${order.orderId}&reason=${encodeURIComponent(failure_message || 'Payment failed')}`;

    // For API responses
    if (req.headers.accept?.includes('application/json')) {
      return res.status(200).json({
        success: payment_status === 'Success',
        message: payment_status === 'Success' ? 'Payment successful' : 'Payment failed',
        orderId: order.orderId,
        redirectUrl
      });
    }

    // For browser redirects
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('CCAvenue callback error:', error);
    
    // For API responses
    if (req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing payment callback',
        error: error.message
      });
    }
    
    // For browser redirects
    return res.redirect(`/buyantivirus/payment-failed?reason=${encodeURIComponent('Server error')}`);
  }
} 