import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import SEO from '../../components/SEO';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';

export async function getStaticPaths() {
  await dbConnect();
  const products = await Product.find({}).select('slug').lean();
  
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 3600, // Revalidate every hour
  };
}

export default function ProductPage({ product }) {
  const router = useRouter();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
        structuredData={productSchema}
        breadcrumbs={breadcrumbs}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
            <p className="text-2xl font-bold">${product.price}</p>
            
            <Button
              onClick={() => router.push(`/checkout?product=${product._id}`)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Purchase Now' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
} 