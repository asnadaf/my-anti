import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
    min: [0, 'Price cannot be negative'],
  },
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category for this product.'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  features: [{
    type: String,
  }],
  inStock: {
    type: Boolean,
    default: true,
  },
  stockCount: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
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
ProductSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});

// Update updatedAt timestamp before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update inStock based on stockCount
ProductSchema.pre('save', function(next) {
  this.inStock = this.stockCount > 0;
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 