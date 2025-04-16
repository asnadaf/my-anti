import crypto from 'crypto';

// CCAvenue configuration
const CCAVENUE_CONFIG = {
  merchantId: process.env.CCAVENUE_MERCHANT_ID,
  accessCode: process.env.CCAVENUE_ACCESS_CODE,
  workingKey: process.env.CCAVENUE_WORKING_KEY,
  redirectUrl: process.env.CCAVENUE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback/ccavenue`,
  cancelUrl: process.env.CCAVENUE_CANCEL_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/buyantivirus/cart`,
  currency: 'INR',
  language: 'EN',
  integrationType: 'iframe', // or 'redirect'
  testMode: process.env.NODE_ENV !== 'production',
};

// Generate encryption for CCAvenue
export const generateEncryption = (orderData) => {
  const {
    orderId,
    amount,
    currency = CCAVENUE_CONFIG.currency,
    language = CCAVENUE_CONFIG.language,
    billingName,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
    billingCountry,
    billingTel,
    billingEmail,
    deliveryName,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZip,
    deliveryCountry,
    deliveryTel,
    merchantParam1,
    merchantParam2,
    merchantParam3,
    merchantParam4,
    merchantParam5,
  } = orderData;

  // Create a string of all parameters
  const params = [
    CCAVENUE_CONFIG.merchantId,
    orderId,
    amount,
    currency,
    language,
    billingName,
    billingAddress,
    billingCity,
    billingState,
    billingZip,
    billingCountry,
    billingTel,
    billingEmail,
    deliveryName,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryZip,
    deliveryCountry,
    deliveryTel,
    merchantParam1,
    merchantParam2,
    merchantParam3,
    merchantParam4,
    merchantParam5,
  ].join('|');

  // Encrypt the parameters
  const encryption = encrypt(params, CCAVENUE_CONFIG.workingKey);

  return encryption;
};

// Encrypt function for CCAvenue
const encrypt = (data, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

// Decrypt function for CCAvenue
export const decrypt = (encryptedData, key) => {
  try {
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Generate CCAvenue payment URL
export const generatePaymentUrl = (orderData) => {
  const encryption = generateEncryption(orderData);
  
  const params = new URLSearchParams({
    encRequest: encryption,
    access_code: CCAVENUE_CONFIG.accessCode,
    command: 'initiateTransaction',
    response_type: 'json',
    redirect_url: CCAVENUE_CONFIG.redirectUrl,
    cancel_url: CCAVENUE_CONFIG.cancelUrl,
  });

  const baseUrl = CCAVENUE_CONFIG.testMode
    ? 'https://test.ccavenue.com/transaction/transaction.do'
    : 'https://secure.ccavenue.com/transaction/transaction.do';

  return `${baseUrl}?${params.toString()}`;
};

// Verify CCAvenue response
export const verifyResponse = (encResponse, orderId, amount) => {
  try {
    const decryptedResponse = decrypt(encResponse, CCAVENUE_CONFIG.workingKey);
    if (!decryptedResponse) return { success: false, message: 'Decryption failed' };

    const responseParams = decryptedResponse.split('|');
    
    // Extract response parameters
    const responseOrderId = responseParams[1];
    const responseAmount = responseParams[2];
    const responseStatus = responseParams[3];
    const responseMessage = responseParams[4];
    
    // Verify order ID and amount
    if (responseOrderId !== orderId) {
      return { success: false, message: 'Order ID mismatch' };
    }
    
    if (parseFloat(responseAmount) !== parseFloat(amount)) {
      return { success: false, message: 'Amount mismatch' };
    }
    
    // Check payment status
    if (responseStatus === 'Success') {
      return { success: true, message: responseMessage };
    } else {
      return { success: false, message: responseMessage };
    }
  } catch (error) {
    console.error('Response verification error:', error);
    return { success: false, message: 'Error verifying response' };
  }
};

export default CCAVENUE_CONFIG; 