const crypto = require('crypto');
const axios = require('axios');

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_VERSION = '2022-09-01';
const CASHFREE_ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'TEST';

// Initialize Cashfree client
const cashfreeClient = axios.create({
  baseURL: `https://${CASHFREE_ENV === 'TEST' ? 'sandbox' : 'api'}.cashfree.com/pg`,
  headers: {
    'x-api-version': CASHFREE_API_VERSION,
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
    'Content-Type': 'application/json'
  }
});

// Generate order ID
const generateOrderId = () => {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create payment session
const createPaymentSession = async (orderData) => {
  try {
    const { amount, customerDetails, orderId } = orderData;
    
    // Validate and convert amount to paise (smallest currency unit)
    const amountInPaise = Math.round(Number(amount) * 100);
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      throw new Error('Invalid amount provided');
    }
    
    // Format customer email to create a valid customer_id
    const customerId = customerDetails.email
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    
    const paymentSession = {
      order_id: orderId,
      order_amount: amountInPaise, // Amount in paise
      order_currency: 'INR',
      order_note: 'Antivirus Software Purchase',
      customer_details: {
        customer_id: customerId,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        customer_name: customerDetails.name
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buyantivirus/order-confirmation?order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback/cashfree`
      },
      payment_methods: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
        paylater: true
      },
      upi: {
        enabled: true,
        collect_by_self: true
      }
    };

    // Log the request for debugging
    console.log('Creating payment session with data:', JSON.stringify(paymentSession, null, 2));
    console.log('Cashfree API URL:', cashfreeClient.defaults.baseURL);
    console.log('Cashfree API Headers:', cashfreeClient.defaults.headers);

    const response = await cashfreeClient.post('/orders', paymentSession);
    
    // Log the full response for debugging
    console.log('Cashfree API Response:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.payment_link) {
      console.error('Cashfree API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      throw new Error('Payment link not received from Cashfree');
    }
    
    return response.data;
  } catch (error) {
    console.error('Cashfree payment session creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    throw new Error(error.response?.data?.message || 'Failed to create payment session');
  }
};

// Verify payment signature
const verifyPaymentSignature = (orderId, orderAmount, referenceId, signature) => {
  const data = `${orderId}${orderAmount}${referenceId}`;
  const expectedSignature = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(data)
    .digest('base64');
  
  return signature === expectedSignature;
};

// Get payment status
const getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfreeClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Cashfree payment status check error:', error);
    throw new Error('Failed to check payment status');
  }
};

module.exports = {
  generateOrderId,
  createPaymentSession,
  verifyPaymentSignature,
  getPaymentStatus
}; 