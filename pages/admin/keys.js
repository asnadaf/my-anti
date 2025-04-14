import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import dbConnect from '../../lib/db';
import LicenseKey from '../../models/LicenseKey';
import Product from '../../models/Product';
import { requireAuth, requireRole } from '../../lib/auth';

export default function AdminKeys({ keys, products }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this license key?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/keys/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.reload();
      } else {
        throw new Error('Failed to delete license key');
      }
    } catch (error) {
      console.error('Error deleting license key:', error);
      alert('Failed to delete license key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title="Manage License Keys" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Manage License Keys
            </h1>
            <button
              onClick={() => router.push('/admin/keys/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add License Key
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {keys.map((key) => (
                <li key={key._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {key.key}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Product: {key.product?.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: {key.status}
                          </p>
                          {key.order && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Order: {key.order}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-4">
                        <button
                          onClick={() => router.push(`/admin/keys/${key._id}/edit`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(key._id)}
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
  const [keys, products] = await Promise.all([
    LicenseKey.find({}).populate('product').lean(),
    Product.find({}).lean(),
  ]);

  return {
    props: {
      keys: JSON.parse(JSON.stringify(keys)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
} 