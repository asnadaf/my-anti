import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); 
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('\n=== Password Comparison Debug ===');
  console.log('Entered Password:', enteredPassword);
  console.log('Stored Password Hash:', this.password);
  console.log('User Email:', this.email);
  
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password Match Result:', isMatch);
    console.log('=== End Password Comparison ===\n');
    return isMatch;
  } catch (error) {
    console.error('Error in password comparison:', error);
    console.log('=== End Password Comparison with Error ===\n');
    return false;
  }
};

// Export the model
let User;
try {
  // Try to get the existing model
  User = mongoose.model('User');
} catch {
  // If the model doesn't exist, create it
  User = mongoose.model('User', UserSchema);
}

export default User; 