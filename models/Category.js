import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this category.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name before saving
CategorySchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});

// Update updatedAt timestamp before saving
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
let Category;
try {
  // Try to get the existing model
  Category = mongoose.model('Category');
} catch {
  // If the model doesn't exist, create it
  Category = mongoose.model('Category', CategorySchema);
}

export default Category; 