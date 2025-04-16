require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectToDatabase() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
}

// Define schemas
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const DurationSchema = new mongoose.Schema({
  deviceCount: Number,
  deviceType: String,
  duration: Number,
  durationUnit: String,
  slug: String,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  originalPrice: Number,
  discountPrice: Number,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  duration: { type: mongoose.Schema.Types.ObjectId, ref: 'Duration' },
  status: String,
  features: [String],
  stockCount: Number,
  tag: String,
  securityFeature: String,
  brand: String,
});

const LicenseKeySchema = new mongoose.Schema({
  key: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  duration: { type: mongoose.Schema.Types.ObjectId, ref: 'Duration' },
  sold: Boolean,
});

// Define models
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Duration = mongoose.models.Duration || mongoose.model('Duration', DurationSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const LicenseKey = mongoose.models.LicenseKey || mongoose.model('LicenseKey', LicenseKeySchema);

// Sample data
const categories = [
  { name: 'Home Security', slug: 'home-security' },
  { name: 'Business Security', slug: 'business-security' },
  { name: 'Enterprise', slug: 'enterprise' },
];

const durations = [
  { deviceCount: 1, deviceType: 'PC', duration: 1, durationUnit: 'Year', slug: '1pc-1year' },
  { deviceCount: 1, deviceType: 'PC', duration: 2, durationUnit: 'Year', slug: '1pc-2year' },
  { deviceCount: 1, deviceType: 'PC', duration: 3, durationUnit: 'Year', slug: '1pc-3year' },
  { deviceCount: 3, deviceType: 'PC', duration: 1, durationUnit: 'Year', slug: '3pc-1year' },
  { deviceCount: 3, deviceType: 'PC', duration: 2, durationUnit: 'Year', slug: '3pc-2year' },
  { deviceCount: 5, deviceType: 'PC', duration: 1, durationUnit: 'Year', slug: '5pc-1year' },
];

const securityFeatures = [
  'Antivirus',
  'Total Protection',
  'Internet Security',
  'Mobile',
  'Server Security'
];

const brands = [
  'Kaspersky',
  'Norton',
  'McAfee',
  'Bitdefender',
  'AVAST',
  'AVG',
  'ESET'
];

// Helper function to generate license key
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

// Main seed function
async function seedDatabase() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Duration.deleteMany({});
    await Product.deleteMany({});
    await LicenseKey.deleteMany({});
    
    // Insert categories
    console.log('Inserting categories...');
    const categoryDocs = await Category.insertMany(categories);
    console.log(`${categoryDocs.length} categories inserted`);
    
    // Insert durations
    console.log('Inserting durations...');
    const durationDocs = await Duration.insertMany(durations);
    console.log(`${durationDocs.length} durations inserted`);
    
    // Generate products
    console.log('Generating products...');
    const productList = [];
    
    // For each security feature and brand combination, create products
    for (const securityFeature of securityFeatures) {
      for (const brand of brands) {
        // Generate 1-3 products for each combination
        const count = Math.floor(Math.random() * 3) + 1; // 1-3
        
        for (let i = 1; i <= count; i++) {
          const tierSuffix = count > 1 ? (i === 1 ? ' Basic' : i === 2 ? ' Pro' : ' Premium') : '';
          const price = 30 + (Math.random() * 70); // $30-$100 base price
          
          // Price multiplier based on security feature
          let priceMultiplier = 1.0;
          if (securityFeature === 'Total Protection') priceMultiplier = 2.0;
          else if (securityFeature === 'Internet Security') priceMultiplier = 1.5;
          else if (securityFeature === 'Server Security') priceMultiplier = 3.0;
          
          const originalPrice = parseFloat((price * priceMultiplier).toFixed(2));
          const discountPrice = parseFloat((originalPrice * 0.8).toFixed(2));
          
          const productName = `${brand} ${securityFeature}${tierSuffix}`;
          const slug = `${brand.toLowerCase()}-${securityFeature.toLowerCase().replace(/\s+/g, '-')}${tierSuffix.toLowerCase().replace(/\s+/g, '-')}`;
          
          const randomCategory = categoryDocs[Math.floor(Math.random() * categoryDocs.length)];
          const randomDuration = durationDocs[Math.floor(Math.random() * durationDocs.length)];
          
          // Sample features
          const features = [
            'Real-time protection',
            'Firewall',
            'Web protection',
            'Email protection',
            'Anti-phishing',
            'Safe banking'
          ];
          
          // Randomly select 3-5 features
          const selectedFeatures = [];
          const featureCount = Math.floor(Math.random() * 3) + 3; // 3-5
          for (let j = 0; j < featureCount; j++) {
            const randomFeature = features[Math.floor(Math.random() * features.length)];
            if (!selectedFeatures.includes(randomFeature)) {
              selectedFeatures.push(randomFeature);
            }
          }
          
          // Random tag
          const tags = ['Featured', 'Top', 'Trending', 'Best Seller', 'New', 'None'];
          const randomTag = tags[Math.floor(Math.random() * tags.length)];
          
          // Random stock count
          const stockCount = Math.floor(Math.random() * 150) + 50; // 50-200
          
          productList.push({
            name: productName,
            slug: slug,
            description: `${brand} ${securityFeature}${tierSuffix} provides comprehensive protection for your devices with advanced security features.`,
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            image: `https://example.com/images/${slug}.jpg`,
            category: randomCategory._id,
            status: 'active',
            features: selectedFeatures,
            stockCount: stockCount,
            tag: randomTag,
            securityFeature: securityFeature,
            brand: brand
          });
        }
      }
    }
    
    console.log(`Generated ${productList.length} products`);
    
    // Insert products
    console.log('Inserting products...');
    const productDocs = await Product.insertMany(productList);
    console.log(`${productDocs.length} products inserted`);
    
    // Generate license keys
    console.log('Generating license keys...');
    const licenseKeys = [];
    
    for (const product of productDocs) {
      // For each product and duration, create 4-5 license keys
      for (const duration of durationDocs) {
        const keyCount = Math.floor(Math.random() * 2) + 4; // 4-5
        
        for (let i = 0; i < keyCount; i++) {
          licenseKeys.push({
            key: generateLicenseKey(),
            product: product._id,
            duration: duration._id,
            sold: Math.random() < 0.3 // 30% sold
          });
        }
      }
    }
    
    console.log(`Generated ${licenseKeys.length} license keys`);
    
    // Insert license keys
    console.log('Inserting license keys...');
    const licenseDocs = await LicenseKey.insertMany(licenseKeys);
    console.log(`${licenseDocs.length} license keys inserted`);
    
    console.log('Database seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    return {
      success: true,
      count: {
        categories: categoryDocs.length,
        durations: durationDocs.length,
        products: productDocs.length,
        licenseKeys: licenseDocs.length
      }
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Close connection if open
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    
    return { success: false, error: error.message };
  }
}

// Run seed function
seedDatabase()
  .then(result => {
    console.log('Seed operation completed with result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error in seed operation:', error);
    process.exit(1);
  }); 