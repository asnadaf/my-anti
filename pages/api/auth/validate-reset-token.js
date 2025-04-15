import dbConnect from '../../../src/lib/db';
import User from '../../../src/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required', valid: false });
  }

  try {
    await dbConnect();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and token hasn't been used
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token', valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token', valid: false });
  }
} 