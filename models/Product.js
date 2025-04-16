import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a unique slug for this product.'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide an original price for this product.'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
  },
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category for this product.'],
  },
  duration: { type: mongoose.Schema.Types.ObjectId, ref: 'Duration' },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  features: [{
    type: String,
  }],
  stockCount: {
    type: Number,
    default: 0,
  },
  tag: {
    type: String,
    enum: ['Featured', 'Top', 'Trending', 'Best Seller', 'New', 'None'],
    default: 'None',
  },
  securityFeature: {
    type: String,
    enum: ['Antivirus', 'Total Protection', 'Internet Security', 'Mobile', 'Server Security'],
    required: [true, 'Please select a security feature type'],
  },
  brand: {
    type: String,
    enum: ['Kaspersky', 'Norton', 'McAfee', 'Bitdefender', 'AVAST', 'AVG', 'ESET', 'Other'],
    required: [true, 'Please select a brand'],
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

// Update updatedAt timestamp
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update inStock based on stockCount
ProductSchema.pre('save', function(next) {
  this.inStock = this.stockCount > 0;
  next();
});

// Fix for the "Cannot read properties of undefined (reading 'Product')" error
// Using a safer pattern for Next.js that ensures mongoose.models exists
const ProductModel = (mongoose.models && mongoose.models.Product) 
  ? mongoose.models.Product 
  : mongoose.model('Product', ProductSchema);

export default ProductModel;
