import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import InstallationGuide from '../../../models/InstallationGuide';

export default async function handler(req, res) {
  const session = await getSession({ req });
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const guides = await InstallationGuide.find({}).sort({ lastUpdated: -1 });
        res.status(200).json(guides);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch installation guides' });
      }
      break;

    case 'POST':
      if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      try {
        const guide = await InstallationGuide.create(req.body);
        res.status(201).json(guide);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create installation guide' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
