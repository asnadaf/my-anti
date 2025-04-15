import dbConnect from './db';
import Category from '../models/Category';

export async function fetchCategories() {
  try {
    await dbConnect();
    
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
} 