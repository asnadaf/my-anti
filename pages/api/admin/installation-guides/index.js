import dbConnect from '@lib/db';
import { requireAdmin } from '@lib/auth';
import InstallationGuide from '@models/InstallationGuide';

export default async function handler(req, res) {
  await dbConnect();
  const adminResult = await requireAdmin(req);

  if (adminResult && adminResult.redirect) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const guides = await InstallationGuide.find({}).sort({ updatedAt: -1 });
        res.status(200).json(guides);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guides' });
      }
      break;

    case 'POST':
      try {
        const guide = await InstallationGuide.create(req.body);
        res.status(201).json(guide);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create guide' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
