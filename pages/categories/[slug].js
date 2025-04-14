import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import dbConnect from '../../lib/db';
import Category from '../../models/Category';
import Product from '../../models/Product';

export async function getStaticPaths() {
  await dbConnect();
  const categories = await Category.find({}).select('slug').lean();
  
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const category = await Category.findOne({ slug: params.slug }).lean();
  
  if (!category) {
    return {
      notFound: true,
    };
  }

  const products = await Product.find({ category: category._id })
    .select('name slug price image stock')
    .lean();

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
    },
    revalidate: 3600, // Revalidate every hour
  };
}

export default function CategoryPage({ category, products }) {
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'Category',
    name: category.name,
    description: category.description,
    image: category.image,
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: category.name, path: `/categories/${category.slug}` },
  ];

  return (
    <>
      <SEO
        title={category.name}
        description={category.description}
        image={category.image}
        structuredData={categorySchema}
        breadcrumbs={breadcrumbs}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="relative h-64 mb-8">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover rounded-lg"
            sizes="100vw"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{category.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-primary font-bold">${product.price}</p>
                  {product.stock <= 0 && (
                    <p className="text-red-500 text-sm">Out of Stock</p>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
} 