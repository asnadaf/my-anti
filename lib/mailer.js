import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

export async function sendLicenseKeyEmail({ to, orderId, licenseKeys }) {
  const subject = 'Your License Keys';
  const html = `
    <h1>Thank you for your purchase!</h1>
    <p>Your order ID: ${orderId}</p>
    <h2>License Keys:</h2>
    <ul>
      ${licenseKeys.map(key => `<li><code>${key}</code></li>`).join('')}
    </ul>
    <p>If you have any questions, please contact our support team.</p>
  `;
  const text = `
    Thank you for your purchase!
    Your order ID: ${orderId}
    License Keys:
    ${licenseKeys.map(key => `- ${key}`).join('\n')}
    If you have any questions, please contact our support team.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendPasswordResetEmail({ to, resetToken }) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `;
  const text = `
    Password Reset
    Click the link below to reset your password:
    ${resetUrl}
    This link will expire in 1 hour.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendSMS({ to, message }) {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

export async function sendLicenseKey({ email, phone, licenseKey, productName }) {
  const emailHtml = `
    <h1>Your License Key</h1>
    <p>Thank you for your purchase!</p>
    <p>Product: ${productName}</p>
    <p>License Key: <strong>${licenseKey}</strong></p>
    <p>Please keep this email safe and do not share your license key with anyone.</p>
  `;

  const smsMessage = `Your ${productName} license key: ${licenseKey}. Please keep this message safe.`;

  const emailSent = await sendEmail({
    to: email,
    subject: `Your ${productName} License Key`,
    html: emailHtml,
  });

  let smsSent = false;
  if (phone) {
    smsSent = await sendSMS({
      to: phone,
      message: smsMessage,
    });
  }

  return { emailSent, smsSent };
}

// SMS integration would go here
// export async function sendSMS({ to, message }) { ... } 