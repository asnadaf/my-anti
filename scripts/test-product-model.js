// Script to test the Product model initialization
require('esm')(module);
const mongoose = require('mongoose');
const { connectToDatabase } = require('../lib/mongodb');

// Helper function to check mongoose connection and models
async function testProductModel() {
  try {
    console.log('Testing Product model initialization');
    console.log('-----------------------------------');
    
    // Step 1: Connect to the database
    console.log('Step 1: Connecting to database...');
    await connectToDatabase();
    console.log('Database connection successful!\n');
    
    // Step 2: Check mongoose connection state
    console.log('Step 2: Checking mongoose connection state');
    console.log(`Connection state: ${mongoose.connection.readyState}`);
    console.log(`0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting\n`);
    
    // Step 3: Check if mongoose.models exists
    console.log('Step 3: Checking if mongoose.models exists');
    console.log(`mongoose.models exists: ${!!mongoose.models}`);
    console.log(`Type of mongoose.models: ${typeof mongoose.models}`);
    console.log(`Object keys: ${Object.keys(mongoose.models).join(', ')}\n`);
    
    // Step 4: Import Product model
    console.log('Step 4: Importing Product model...');
    const Product = require('../models/Product').default;
    console.log(`Product model imported successfully: ${!!Product}`);
    
    // Step 5: Check if Product model is in mongoose.models
    console.log('Step 5: Checking if Product model is in mongoose.models');
    console.log(`Product model in mongoose.models: ${!!mongoose.models.Product}`);
    
    // Step 6: Test Product model by querying
    console.log('Step 6: Testing Product model with a query...');
    const products = await Product.find().limit(1);
    console.log(`Query successful! Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('Sample product details:');
      console.log(`- Name: ${products[0].name}`);
      console.log(`- Brand: ${products[0].brand}`);
      console.log(`- Security Feature: ${products[0].securityFeature}`);
    }
    
    console.log('\nProduct model test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Product model:', error);
    return false;
  } finally {
    // Close the connection when done
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the test
testProductModel()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 