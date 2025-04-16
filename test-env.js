require('dotenv').config({ path: './.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV); 