import dbConnect from './db';
import Brand from '../models/Brand';

export const DEFAULT_BRANDS = [
  { name: 'Trend Micro', description: 'Global leader in hybrid cloud security' },
  { name: 'CCleaner', description: 'Professional system optimization and security' },
  { name: 'Siyanoav', description: 'Advanced antivirus protection' },
  { name: 'Quick Heal', description: 'Comprehensive security solutions' },
  { name: 'Seqrite', description: 'Enterprise-grade security' },
  { name: 'K7', description: 'Innovative cybersecurity solutions' },
  { name: 'Kaspersky', description: 'World-class antivirus protection' },
  { name: 'McAfee', description: 'Complete security for your digital life' },
  { name: 'ESET', description: 'Advanced protection against cyber threats' },
  { name: 'NPAV', description: 'Next-generation antivirus protection' },
];

export async function initializeBrands() {
  try {
    await dbConnect();
    
    for (const brandData of DEFAULT_BRANDS) {
      const existingBrand = await Brand.findOne({ name: brandData.name });
      
      if (!existingBrand) {
        await Brand.create(brandData);
        console.log(`Created brand: ${brandData.name}`);
      }
    }
    
    console.log('Brand initialization completed');
  } catch (error) {
    console.error('Error initializing brands:', error);
  }
} 