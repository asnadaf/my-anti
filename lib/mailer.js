import nodemailer from 'nodemailer';

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
    <h1>Password Reset Request</h1>
    <p>You requested a password reset for your account.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  const text = `
    Password Reset Request
    You requested a password reset for your account.
    Click the link below to reset your password:
    ${resetUrl}
    This link will expire in 1 hour.
    If you didn't request this, please ignore this email.
  `;

  return sendEmail({ to, subject, html, text });
}

export async function sendLicenseKey({ email, licenseKey, productName }) {
  const subject = `Your ${productName} License Key`;
  const html = `
    <h1>Your License Key</h1>
    <p>Thank you for purchasing ${productName}!</p>
    <p>Your license key is:</p>
    <p><code>${licenseKey}</code></p>
    <p>If you have any questions, please contact our support team.</p>
  `;
  const text = `
    Your License Key
    Thank you for purchasing ${productName}!
    Your license key is: ${licenseKey}
    If you have any questions, please contact our support team.
  `;

  return sendEmail({ to: email, subject, html, text });
} 