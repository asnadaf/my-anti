import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import Category from '../../models/Category';
import { requireAuth, requireRole } from '../../lib/auth';

export default function AdminProducts({ products, categories }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.reload();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title="Manage Products" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Manage Products
            </h1>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <li key={product._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Price: ${product.price}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category: {product.category?.name || 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-4">
                        <button
                          onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const auth = await requireAuth(context.req, context.res);
  if (!auth) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const roleCheck = await requireRole(['admin'])(context.req, context.res);
  if (!roleCheck) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await dbConnect();
  const [products, categories] = await Promise.all([
    Product.find({}).populate('category').lean(),
    Category.find({}).lean(),
  ]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
} 