import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
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
  type: {
    type: String,
    enum: ['security', 'antivirus', 'total-protection', 'internet-security', 'mobile', 'server-security', 'games'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create slug from name before saving
CategorySchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  next();
});

// Predefined categories
export const DEFAULT_CATEGORIES = [
  { name: 'Security', type: 'security', description: 'General security solutions' },
  { name: 'Antivirus', type: 'antivirus', description: 'Basic antivirus protection' },
  { name: 'Total Protection', type: 'total-protection', description: 'Complete security suite' },
  { name: 'Internet Security', type: 'internet-security', description: 'Advanced internet protection' },
  { name: 'Mobile', type: 'mobile', description: 'Mobile device security' },
  { name: 'Server Security', type: 'server-security', description: 'Enterprise server protection' },
  { name: 'Games', type: 'games', description: 'Gaming security solutions' },
];

export default mongoose.models.Category || mongoose.model('Category', CategorySchema); 