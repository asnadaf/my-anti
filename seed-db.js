// CommonJS version of the seed script
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

// Force console output
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  process.stdout.write(args.join(' ') + '\n');
};

console.log('=====================================');
console.log('Starting database seed');
console.log('=====================================');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

// MongoDB connection
const connectToDatabase = async () => {
  console.log('Attempting to connect to MongoDB...');
  
  if (mongoose.connections[0].readyState) {
    console.log('Using existing database connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Seed function
async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Duration.deleteMany({});
    await Product.deleteMany({});
    await LicenseKey.deleteMany({});
    console.log('Existing data cleared');

    // ... rest of the function ...
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the connection when done
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('=====================================');
    console.log('Seed completed successfully');
    console.log('=====================================');
    process.exit(0);
  })
  .catch((error) => {
    console.error('=====================================');
    console.error('Seed failed with error:');
    console.error(error);
    console.error('=====================================');
    process.exit(1);
  }); 