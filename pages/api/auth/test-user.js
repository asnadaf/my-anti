import dbConnect from '@lib/db';
import User from '@models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Find the user by email
    const user = await User.findOne({ email: 'aa@aa.aa' }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data including password hash for debugging
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        passwordHash: user.password, // Only for debugging
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 