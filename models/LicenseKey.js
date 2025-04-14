import mongoose from 'mongoose';

const LicenseKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Please provide a license key.'],
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide a product for this license key.'],
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  sold: {
    type: Boolean,
    default: false,
  },
  soldAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate a random license key before saving
LicenseKeySchema.pre('save', function(next) {
  if (!this.key) {
    this.key = generateLicenseKey();
  }
  next();
});

// Helper function to generate a random license key
function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  let key = '';

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segmentLength; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < segments - 1) {
      key += '-';
    }
  }

  return key;
}

export default mongoose.models.LicenseKey || mongoose.model('LicenseKey', LicenseKeySchema); 