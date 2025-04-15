import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a category slug'],
    unique: true,
  },
  description: {
    type: String,
    required: false,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  image: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema); 