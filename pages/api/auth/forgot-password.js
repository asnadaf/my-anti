import dbConnect from '@lib/db';
import User from '@models/User';
import { generateToken } from '@lib/auth';
import { sendPasswordResetEmail } from '@lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return res.status(200).json({ message: 'If an account exists, you will receive an email with reset instructions' });
    }

    // Generate reset token
    const resetToken = generateToken({ userId: user._id });

    // Set reset token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail({
      to: user.email,
      resetToken,
    });

    res.status(200).json({ message: 'If an account exists, you will receive an email with reset instructions' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 