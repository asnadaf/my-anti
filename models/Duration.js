import mongoose from 'mongoose';

const DurationSchema = new mongoose.Schema({
        deviceCount: {
          type: Number,
          required: true,
        },
        deviceType: {
          type: String,
          enum: ['PC', 'Cell'],
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        durationUnit: {
          type: String,
          enum: ['Month', 'Year'],
          required: true,
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
DurationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Fix for the "Cannot read properties of undefined (reading 'Duration')" error
// Using a safer pattern for Next.js that ensures mongoose.models exists
const DurationModel = (mongoose.models && mongoose.models.Duration) 
  ? mongoose.models.Duration 
  : mongoose.model('Duration', DurationSchema);

export default DurationModel;

