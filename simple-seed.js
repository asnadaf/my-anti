require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

async function main() {
  console.log('Testing MongoDB connection');
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Define a simple schema
    const TestSchema = new mongoose.Schema({
      name: String,
      created: { type: Date, default: Date.now }
    });
    
    // Create a model
    const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    // Insert a test document
    console.log('Inserting test document...');
    const result = await Test.create({ name: 'Test ' + new Date().toISOString() });
    console.log('Test document inserted:', result);
    
    // Count documents
    const count = await Test.countDocuments();
    console.log(`Total test documents: ${count}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
}

main()
  .then(result => {
    console.log('Operation completed with result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 