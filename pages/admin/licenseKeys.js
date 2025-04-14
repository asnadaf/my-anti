import { useState } from 'react';
import { useRouter } from 'next/router';
// import Layout from '@components/Layout';
import SEO from '@components/SEO';
import dbConnect from '@lib/db';
import LicenseKey from '@models/LicenseKey';
import { requireAuth } from '@lib/auth';

export default function LicenseKeysPage({ licenseKeys: initialLicenseKeys }) {
  const [licenseKeys, setLicenseKeys] = useState(initialLicenseKeys);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = initialLicenseKeys.filter(
      (key) =>
        key.key.toLowerCase().includes(e.target.value.toLowerCase()) ||
        key.product?.name?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setLicenseKeys(filtered);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    const filtered = initialLicenseKeys.filter(
      (key) => !e.target.value || key.status === e.target.value
    );
    setLicenseKeys(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this license key?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/licenseKeys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete license key');
      }

      setLicenseKeys(licenseKeys.filter((key) => key._id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="License Keys" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">License Keys</h1>
          <button
            onClick={() => router.push('/admin/licenseKeys/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add New License Key
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by key or product name..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {licenseKeys.map((licenseKey) => (
                <tr key={licenseKey._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{licenseKey.key}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{licenseKey.product?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        licenseKey.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : licenseKey.status === 'used'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {licenseKey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(licenseKey.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/licenseKeys/${licenseKey._id}/edit`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(licenseKey._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
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

  const licenseKeys = await LicenseKey.find({})
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      licenseKeys: JSON.parse(JSON.stringify(licenseKeys)),
    },
  };
} 