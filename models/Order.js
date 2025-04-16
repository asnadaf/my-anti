import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Please provide an order ID.'],
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  licenseKeys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LicenseKey',
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please provide a payment method.'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
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

// Update updatedAt timestamp before saving
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total before saving
OrderSchema.pre('save', function(next) {
  this.total = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

let Order;

try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
}

export default Order; 