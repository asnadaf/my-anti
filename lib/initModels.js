import mongoose from 'mongoose';
import { CategorySchema } from '../models/Category';
import Product from '../models/Product';
import Duration from '../models/Duration';

// Initialize models
export async function initializeModels() {
  try {
    // Ensure mongoose is properly initialized
    if (!mongoose || typeof mongoose !== 'object') {
      throw new Error('Mongoose is not properly initialized');
    }

    // Initialize models if they don't exist
    if (!mongoose.models?.Category) {
      mongoose.model('Category', CategorySchema);
    }
    if (!mongoose.models?.Product) {
      mongoose.model('Product', Product.schema);
    }
    if (!mongoose.models?.Duration) {
      mongoose.model('Duration', Duration.schema);
    }
    
    console.log('Models initialized successfully');
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
} 