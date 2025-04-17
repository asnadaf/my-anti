import { verifyPaymentSignature, getPaymentStatus } from '../../../../lib/cashfree';
import { updateOrderStatus } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      orderAmount,
      referenceId,
      txStatus,
      paymentMode,
      signature
    } = req.body;

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      orderId,
      orderAmount,
      referenceId,
      signature
    );

    if (!isValidSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Get detailed payment status
    const paymentStatus = await getPaymentStatus(orderId);

    // Update order status in database
    const status = txStatus === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
    await updateOrderStatus(orderId, status, {
      paymentId: referenceId,
      paymentMode,
      paymentStatus: paymentStatus
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Cashfree callback error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process payment callback'
    });
  }
} 