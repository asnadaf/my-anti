import mongoose from 'mongoose';
import { initializeModels } from './initModels';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

// Check if we're running on the browser or server
const isServer = typeof window === 'undefined';

if (!MONGODB_URI && isServer) {
  throw new Error('Please define the NEXT_PUBLIC_MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we're in the browser, return a mock connection
  if (!isServer) {
    console.log('Running in browser environment - skipping actual MongoDB connection');
    return { connection: { readyState: 1 } };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = Promise.resolve().then(async () => {
      try {
        // Only attempt to connect if we're on the server
        if (!mongoose || typeof mongoose !== 'object') {
          throw new Error('Mongoose not available');
        }

        // Handle different versions of mongoose
        let connection;
        if (typeof mongoose.connect === 'function') {
          connection = await mongoose.connect(MONGODB_URI, opts);
        } else if (mongoose.default && typeof mongoose.default.connect === 'function') {
          connection = await mongoose.default.connect(MONGODB_URI, opts);
        } else {
          throw new Error('Mongoose connect method not found. Check MongoDB configuration.');
        }
        
        // Initialize models after connection
        await initializeModels();
        
        console.log('MongoDB connected successfully');
        return connection;
      } catch (err) {
        console.error('MongoDB connection error:', err);
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