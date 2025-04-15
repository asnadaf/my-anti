import dbConnect from '@lib/db';
import Duration from '@models/Duration';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const durations = await Duration.find({}).sort({ months: 1 });
        res.status(200).json({ success: true, data: durations });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const duration = await Duration.create(req.body);
        res.status(201).json({ success: true, data: duration });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
} 