import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a product slug'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%'],
  },
  devices: {
    type: Number,
    required: [true, 'Please provide the number of devices'],
    min: [1, 'Number of devices must be at least 1'],
  },
  duration: {
    type: String,
    required: [true, 'Please provide the license duration'],
    enum: ['1 Month', '3 Months', '6 Months', '1 Year', '2 Years', '3 Years'],
  },
  features: [{
    type: String,
  }],
  image: {
    type: String,
    required: false,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  brand: {
    type: String,
    required: [true, 'Please provide the brand name'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category'],
  },
  rating: {
    type: Number,
    required: false,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
  },
  reviews: {
    type: Number,
    required: false,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 