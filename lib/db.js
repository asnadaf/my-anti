import mongoose from 'mongoose';
import { initializeModels } from './initModels';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the NEXT_PUBLIC_MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      try {
        // Initialize models after connection
        await initializeModels();
        console.log('MongoDB connected successfully');
        return mongoose;
      } catch (err) {
        console.error('Error during model initialization:', err);
        throw err;
      }
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export async function updateOrderStatus(orderId, status, paymentStatus) {
  await dbConnect();
  const Order = mongoose.models.Order;
  
  if (!Order) {
    throw new Error('Order model not initialized');
  }

  const result = await Order.findOneAndUpdate(
    { orderId },
    { 
      $set: { 
        status,
        paymentStatus
      } 
    },
    { new: true }
  );

  if (!result) {
    throw new Error('Order not found');
  }

  return result;
}

export default dbConnect; 