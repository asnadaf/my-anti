import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import Duration from '../models/Duration';
import LicenseKey from '../models/LicenseKey';
import { connectToDatabase } from './mongodb';

// Sample data for seeding
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

// Security features for products
const securityFeatures = [
  'Antivirus',
  'Total Protection',
  'Internet Security',
  'Mobile',
  'Server Security'
];

// Brands for products
const brands = [
  'Kaspersky',
  'Norton',
  'McAfee',
  'Bitdefender',
  'AVAST',
  'AVG',
  'ESET'
];

// Base product templates for each security feature
const productTemplates = [
  // Antivirus products
  {
    name: 'Basic Antivirus',
    description: 'Essential protection against viruses, spyware, and other malware with real-time security updates.',
    originalPrice: 39.99,
    discountPrice: 29.99,
    features: [
      'Essential virus protection',
      'Real-time security updates',
      'Email protection',
      'Web protection',
    ],
    securityFeature: 'Antivirus',
  },
  // Total Protection products
  {
    name: 'Total Protection Suite',
    description: 'Comprehensive security suite with advanced protection against all types of threats plus privacy and performance tools.',
    originalPrice: 89.99,
    discountPrice: 59.99,
    features: [
      'Advanced virus protection',
      'Firewall protection',
      'Password manager',
      'File encryption',
      'VPN service',
      'Performance optimization',
    ],
    securityFeature: 'Total Protection',
  },
  // Internet Security products
  {
    name: 'Internet Security',
    description: 'Complete online protection with advanced security for internet browsing, banking, and shopping.',
    originalPrice: 69.99,
    discountPrice: 49.99,
    features: [
      'Safe browsing',
      'Banking protection',
      'Anti-phishing',
      'Ransomware shield',
      'Webcam protection',
    ],
    securityFeature: 'Internet Security',
  },
  // Mobile products
  {
    name: 'Mobile Security',
    description: 'Premium security solution for smartphones and tablets with anti-theft and privacy protection.',
    originalPrice: 34.99,
    discountPrice: 24.99,
    features: [
      'Anti-theft protection',
      'App privacy scanner',
      'Safe browsing',
      'Wi-Fi security',
      'Call blocker',
    ],
    securityFeature: 'Mobile',
  },
  // Server Security products
  {
    name: 'Server Security',
    description: 'Enterprise-grade protection for servers with advanced threat detection and management console.',
    originalPrice: 199.99,
    discountPrice: 149.99,
    features: [
      'Server-specific protection',
      'File server security',
      'Mail server security',
      'Centralized management',
      'Vulnerability scanner',
      'Exploit prevention',
    ],
    securityFeature: 'Server Security',
  },
];

// Generate a random license key
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

// Generate a random stock count between 50 and 200
function randomStockCount() {
  return Math.floor(Math.random() * 151) + 50;
}

// Generate a random tag from the available options
function randomTag() {
  const tags = ['Featured', 'Top', 'Trending', 'Best Seller', 'New', 'None'];
  return tags[Math.floor(Math.random() * tags.length)];
}

// Generate a random modifier for prices (±20%)
function randomPriceModifier() {
  return 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
}

// Pick a random element from an array
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate a slug from a product name
function generateSlug(name, brand, securityFeature) {
  return `${brand.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, '-')}-${securityFeature.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Seeds the database with sample data
 */
export async function seedDatabase() {
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

    // Insert categories
    console.log('Inserting categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories inserted`);

    // Insert durations
    console.log('Inserting durations...');
    const createdDurations = await Duration.insertMany(durations);
    console.log(`${createdDurations.length} durations inserted`);

    // Generate products for all combinations
    console.log('Generating products...');
    const products = [];
    
    // For each brand
    for (const brand of brands) {
      // For each security feature
      for (const template of productTemplates) {
        const securityFeature = template.securityFeature;
        
        // Create 1-3 random variations of this product
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 products
        
        for (let i = 0; i < count; i++) {
          const priceModifier = randomPriceModifier();
          const originalPrice = template.originalPrice * priceModifier;
          const discountPrice = template.discountPrice * priceModifier;
          
          // Variation suffix based on tier
          let nameSuffix = '';
          if (count > 1) {
            nameSuffix = i === 0 ? ' Essential' : i === 1 ? ' Pro' : ' Premium';
          }
          
          const productName = `${brand} ${template.name}${nameSuffix}`;
          
          products.push({
            name: productName,
            slug: generateSlug(template.name + nameSuffix, brand, securityFeature),
            description: template.description,
            originalPrice: parseFloat(originalPrice.toFixed(2)),
            discountPrice: parseFloat(discountPrice.toFixed(2)),
            image: `https://example.com/${brand.toLowerCase()}-${securityFeature.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            status: 'active',
            features: template.features,
            stockCount: randomStockCount(),
            tag: randomTag(),
            securityFeature: securityFeature,
            brand: brand,
          });
        }
      }
    }

    console.log(`Generated ${products.length} product variations`);

    // Insert products with references to categories and durations
    const productsWithReferences = products.map((product) => {
      // Assign random category
      const category = randomPick(createdCategories);
      
      return {
        ...product,
        category: category._id,
      };
    });

    console.log('Inserting products...');
    const createdProducts = await Product.insertMany(productsWithReferences);
    console.log(`${createdProducts.length} products inserted`);

    // Generate license keys for each product
    console.log('Generating license keys...');
    const licenseKeys = [];
    
    for (const product of createdProducts) {
      // For each product, create keys for each duration
      for (const duration of createdDurations) {
        // Create 4-5 keys for each product-duration combination
        const keyCount = Math.floor(Math.random() * 2) + 4; // 4-5 keys
        
        for (let i = 0; i < keyCount; i++) {
          licenseKeys.push({
            key: generateLicenseKey(),
            product: product._id,
            duration: duration._id,
            sold: Math.random() < 0.3, // 30% chance of being sold
          });
        }
      }
    }

    console.log(`Generated ${licenseKeys.length} license keys`);
    console.log('Inserting license keys...');
    const createdLicenseKeys = await LicenseKey.insertMany(licenseKeys);
    console.log(`${createdLicenseKeys.length} license keys inserted`);

    console.log('Database seeded successfully');
    return {
      categories: createdCategories,
      durations: createdDurations,
      products: createdProducts,
      licenseKeys: createdLicenseKeys
    };
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

// If this script is run directly (not imported)
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
} 