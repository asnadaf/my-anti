import dbConnect from '../../../lib/db';
import Duration from '../../../models/Duration';

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
        console.log('Request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        // Validate required fields
        const { deviceCount, deviceType, duration, durationUnit } = req.body;
        
        if (!deviceCount || !deviceType || !duration || !durationUnit ) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields. Required: deviceCount, deviceType, duration, durationUnit, label' 
          });
        }
        
        // Calculate months if not provided
        let months = req.body.months;
        if (!months) {
          months = durationUnit === 'Year' ? duration * 12 : duration;
        }
        
        // Create duration with calculated months
        const newDuration = await Duration.create({
          ...req.body,
          months
        });
        
        res.status(201).json({ success: true, data: newDuration });
      } catch (error) {
        console.error('Error creating duration:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
} 