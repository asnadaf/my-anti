import { verifyToken, getRedirectPath } from '@lib/auth';
import dbConnect from '@lib/db';
import User from '@models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided',
        redirect: '/auth/login'
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        message: 'Invalid token',
        redirect: '/auth/login'
      });
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        redirect: '/auth/login'
      });
    }

    // Get the correct redirect path based on user role
    const redirectPath = getRedirectPath(user);

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      redirectPath
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      redirect: '/auth/login'
    });
  }
} 