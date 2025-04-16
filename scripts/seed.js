// Script to seed the database with sample data
import { seedDatabase } from '../lib/seed';

console.log('Starting database seeding...');

seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  }); 