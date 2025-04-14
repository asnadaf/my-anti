# Next.js E-commerce Platform

A full-stack e-commerce platform built with Next.js, MongoDB, and Tailwind CSS. Features include JWT authentication, admin dashboard, client dashboard, and license key management.

## Features

- Server-side rendering (SSR) with Next.js
- MongoDB with Mongoose for data storage
- JWT authentication with httpOnly cookies
- Admin dashboard for managing categories, products, and users
- Client dashboard for browsing and purchasing products
- License key management and delivery system
- SEO optimization with dynamic meta tags and JSON-LD
- Responsive design with Tailwind CSS and shadcn/ui
- Dark mode support
- Email and SMS notifications

## Prerequisites

- Node.js 14.x or later
- MongoDB 4.4 or later
- SMTP server for email notifications
- SMS API credentials (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database
   JWT_SECRET=your-secret-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # SMTP Configuration
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   SMTP_FROM_EMAIL=noreply@example.com
   SMTP_FROM_NAME="Your Site Name"
   
   # SMS Configuration (optional)
   SMS_API_KEY=your-sms-api-key
   SMS_API_SECRET=your-sms-api-secret
   SMS_FROM_NUMBER=your-sms-number
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
my-app/
├── components/                 # Reusable UI & SEO components
├── lib/                        # Helpers & utilities
├── models/                     # Mongoose models
├── pages/                      # Next.js pages
├── public/                     # Static assets
└── styles/                     # Global styles
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/categories` - Category management
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/keys` - License key management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
