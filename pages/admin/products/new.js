import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout';
import SEO from '@components/SEO';
import dbConnect from '@lib/db';
import Category from '@models/Category';
import { requireAuth } from '@lib/auth';

export default function NewProduct({ categories }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'active',
    image: '',
    features: [''],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <Layout>
      <SEO title="Add New Product" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
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
                Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-primary hover:text-primary-dark"
                >
                  Add Feature
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
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

  if (auth.role !== 'admin') {
    return {
      redirect: {
        destination: '/client',
        permanent: false,
      },
    };
  }

  await dbConnect();
  const categories = await Category.find({}).lean();

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
} 