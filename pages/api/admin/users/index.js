import { requireAuth, requireRole } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const auth = await requireAuth(req, res);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const roleCheck = await requireRole(['admin'])(req, res);
  if (!roleCheck) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const users = await User.find({}).select('-password').lean();
        return res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching users' });
      }

    case 'POST':
      try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
        });

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json(userWithoutPassword);
      } catch (error) {
        return res.status(500).json({ message: 'Error creating user' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 