import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import InstallationGuide from '../../../models/InstallationGuide';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const guide = await InstallationGuide.findById(id);
        if (!guide) {
          return res.status(404).json({ error: 'Guide not found' });
        }
        res.status(200).json(guide);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guide' });
      }
      break;

    case 'PUT':
      if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      try {
        const guide = await InstallationGuide.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!guide) {
          return res.status(404).json({ error: 'Guide not found' });
        }
        res.status(200).json(guide);
      } catch (error) {
        res.status(400).json({ error: 'Failed to update guide' });
      }
      break;

    case 'DELETE':
      if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      try {
        const guide = await InstallationGuide.findByIdAndDelete(id);
        if (!guide) {
          return res.status(404).json({ error: 'Guide not found' });
        }
        res.status(200).json({ message: 'Guide deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete guide' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
