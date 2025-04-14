import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout';
import SEO from '@components/SEO';
import dbConnect from '@lib/db';
import Product from '@models/Product';
import { requireAuth } from '@lib/auth';

export default function NewLicenseKeyPage({ products }) {
  const [formData, setFormData] = useState({
    key: '',
    status: 'active',
    product: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/licenseKeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create license key');
      }

      router.push('/admin/licenseKeys');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <SEO title="New License Key" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">New License Key</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">License Key</label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/licenseKeys')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create License Key'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const auth = await requireAuth(context.req, context.res);
  if (!auth || auth.role !== 'admin') {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const products = await Product.find({}).select('name').lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
} 