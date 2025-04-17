import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import Duration from '../models/Duration';
import User from '../models/User';
import Order from '../models/Order';
import LicenseKey from '../models/LicenseKey';

// Initialize models
export async function initializeModels() {
  try {
    // Ensure mongoose is properly initialized
    if (!mongoose || typeof mongoose !== 'object') {
      throw new Error('Mongoose is not properly initialized');
    }

    // Initialize models in sequence to avoid race conditions
    const models = [
      { name: 'Category', model: Category },
      { name: 'Product', model: Product },
      { name: 'Duration', model: Duration },
      { name: 'User', model: User },
      { name: 'Order', model: Order },
      { name: 'LicenseKey', model: LicenseKey }
    ];

    for (const { name, model } of models) {
      try {
        if (!mongoose.models[name]) {
          console.log(`Initializing ${name} model...`);
          // The model will self-register through its export logic
          await Promise.resolve(model);
        }
      } catch (error) {
        console.error(`Error initializing ${name} model:`, error);
        throw error;
      }
    }
    
    console.log('All models initialized successfully');
  } catch (error) {
    console.error('Error in model initialization:', error);
    throw error;
  }
} 