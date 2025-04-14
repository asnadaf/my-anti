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

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const user = await User.findById(id).select('-password').lean();
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching user' });
      }

    case 'PUT':
      try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !role) {
          return res.status(400).json({ message: 'Name, email, and role are required' });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email !== user.email) {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
          }
        }

        // Update user
        user.name = name;
        user.email = email;
        user.role = role;

        // Update password if provided
        if (password) {
          user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        // Remove password from response
        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json(updatedUser);
      } catch (error) {
        return res.status(500).json({ message: 'Error updating user' });
      }

    case 'DELETE':
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting user' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 