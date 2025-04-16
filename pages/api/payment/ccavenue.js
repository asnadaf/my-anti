import { generatePaymentUrl } from '../../../../lib/ccavenue';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prepare order data for CCAvenue
    const orderData = {
      merchant_id: process.env.CCAVENUE_MERCHANT_ID,
      order_id: order.orderId,
      amount: order.totalAmount,
      currency: 'INR',
      redirect_url: process.env.CCAVENUE_REDIRECT_URL,
      cancel_url: process.env.CCAVENUE_CANCEL_URL,
      language: 'EN',
      billing_name: order.shippingAddress.name,
      billing_address: order.shippingAddress.address,
      billing_city: order.shippingAddress.city,
      billing_state: order.shippingAddress.state,
      billing_zip: order.shippingAddress.pincode,
      billing_country: 'India',
      billing_tel: order.shippingAddress.phone,
      billing_email: order.shippingAddress.email,
      delivery_name: order.shippingAddress.name,
      delivery_address: order.shippingAddress.address,
      delivery_city: order.shippingAddress.city,
      delivery_state: order.shippingAddress.state,
      delivery_zip: order.shippingAddress.pincode,
      delivery_country: 'India',
      delivery_tel: order.shippingAddress.phone,
      merchant_param1: order._id.toString(), // Store MongoDB _id for callback
      merchant_param2: order.orderId, // Store orderId for reference
      merchant_param3: order.totalAmount.toString(), // Store amount for verification
      integration_type: 'iframe_normal'
    };

    // Generate payment URL
    const paymentUrl = generatePaymentUrl(orderData);

    // Update order with payment initiation
    order.paymentStatus = 'pending';
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentMethod: 'ccavenue',
      initiatedAt: new Date()
    };
    await order.save();

    return res.status(200).json({ 
      success: true, 
      paymentUrl,
      orderId: order.orderId
    });
  } catch (error) {
    console.error('CCAvenue payment initiation error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error initiating payment',
      error: error.message
    });
  }
}