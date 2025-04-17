import mongoose from 'mongoose';

const installationGuideSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    }
  }],
  requirements: {
    type: [String],
    default: []
  },
  troubleshooting: [{
    problem: {
      type: String,
      required: true
    },
    solution: {
      type: String,
      required: true
    }
  }],
  videoUrl: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.InstallationGuide || mongoose.model('InstallationGuide', installationGuideSchema);
