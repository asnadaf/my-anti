import { useState } from 'react';
import { useRouter } from 'next/router';
// import Layout from '@components/Layout';
import SEO from '@components/SEO';
import dbConnect from '@lib/db';
import { requireAuth } from '@lib/auth';

export default function NewCategory() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create category');
      }

      router.push('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Add New Category" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Category</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/categories')}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
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

  if (auth.role !== 'admin') {
    return {
      redirect: {
        destination: '/client',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
} 