import { createPaymentSession, generateOrderId } from '../../../lib/cashfree';
import { updateOrderStatus } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId, amount, customerDetails } = req.body;

    // Validate required fields
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    if (!customerDetails || !customerDetails.email || !customerDetails.phone || !customerDetails.name) {
      return res.status(400).json({
        success: false,
        message: 'Customer details are incomplete'
      });
    }

    // Create payment session with Cashfree
    const paymentSession = await createPaymentSession({
      orderId: orderId || generateOrderId(),
      amount: Number(amount), // Ensure amount is a number
      customerDetails
    });

    // Update order status in database
    await updateOrderStatus(orderId, 'PENDING');

    return res.status(200).json({
      success: true,
      paymentUrl: paymentSession.payment_link,
      orderId: paymentSession.order_id
    });
  } catch (error) {
    console.error('Cashfree payment initiation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment'
    });
  }
} 