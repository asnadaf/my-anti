import dbConnect from '@lib/db';
import Duration from '../../../models/Duration';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const duration = await Duration.findById(id);
        if (!duration) {
          return res.status(404).json({ success: false, error: 'Duration not found' });
        }
        res.status(200).json({ success: true, data: duration });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const duration = await Duration.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!duration) {
          return res.status(404).json({ success: false, error: 'Duration not found' });
        }
        res.status(200).json({ success: true, data: duration });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const duration = await Duration.findByIdAndDelete(id);
        if (!duration) {
          return res.status(404).json({ success: false, error: 'Duration not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
} 