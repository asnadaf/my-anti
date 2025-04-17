import mongoose from 'mongoose';

const licenseKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    duration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Duration',
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a random license key before saving
licenseKeySchema.pre('save', function(next) {
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

// Export the model
let LicenseKey;
try {
  // Try to get the existing model
  LicenseKey = mongoose.model('LicenseKey');
} catch {
  // If the model doesn't exist, create it
  LicenseKey = mongoose.model('LicenseKey', licenseKeySchema);
}

export default LicenseKey;