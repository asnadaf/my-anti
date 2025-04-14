import { setAuthCookie, generateToken } from '@lib/auth';
import dbConnect from '@lib/db';
import User from '@models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  await dbConnect();

  try {
    console.log('\n=== Login Attempt Debug ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      console.log('=== End Login Attempt (User Not Found) ===\n');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Debug password comparison
    console.log('\n=== Password Debug ===');
    console.log('Stored password hash:', user.password);
    console.log('Attempting to compare passwords...');
    
    // Direct bcrypt comparison for debugging
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt comparison result:', isMatch);
    
    // Method comparison
    const methodMatch = await user.matchPassword(password);
    console.log('Method comparison result:', methodMatch);
    console.log('=== End Password Debug ===\n');

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      console.log('=== End Login Attempt (Invalid Password) ===\n');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with stringified ObjectId
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    console.log('Token payload:', tokenPayload);
    
    const token = generateToken(tokenPayload);
    console.log('Token generated successfully');

    // Set httpOnly cookie
    setAuthCookie(res, token);
    console.log('Auth cookie set');

    // Return user data (excluding password)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log('Login successful for user:', email);
    console.log('=== End Login Attempt (Success) ===\n');
    res.status(200).json(userData);
  } catch (error) {
    console.error('\n=== Login Error ===');
    console.error('Error details:', error);
    console.error('=== End Login Attempt (Error) ===\n');
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 