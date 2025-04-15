import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: true,
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
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%'],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Please provide a brand'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category'],
  },
  subscription: {
    devices: {
      type: Number,
      required: [true, 'Please provide the number of devices'],
      enum: [1, 2, 3],
    },
    duration: {
      type: String,
      required: [true, 'Please provide the subscription duration'],
      enum: ['6months', '1year', '2years', '3years'],
    },
  },
  features: [{
    type: String,
  }],
  image: {
    type: String,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  user:{
    type : Number
  },
  duration:{
      type : String
  }
}, {
  timestamps: true,
});

// Create slug from name before saving
ProductSchema.pre('save', function (next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});



export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 