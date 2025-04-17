import { requireAdmin } from '@lib/auth';
import dbConnect from '@lib/db';
import Category from '@models/Category';
import Product from '@models/Product';
import LicenseKey from '@models/LicenseKey';
import User from '@models/User';
import Order from '@models/Order';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen } from 'lucide-react';

export default function AdminDashboard({ stats, recentOrders }) {
  const router = useRouter();

  const dashboardItems = [
    {
      title: "Categories",
      description: "Manage categories",
      icon: null,
      href: "/admin/categories",
      count: stats.categories
    },
    {
      title: "Products",
      description: "Manage products",
      icon: null,
      href: "/admin/products",
      count: stats.products
    },
    {
      title: "License Keys",
      description: "Manage license keys",
      icon: null,
      href: "/admin/licenseKeys",
      count: stats.keys
    },
    {
      title: "Users",
      description: "Manage user accounts",
      icon: null,
      href: "/admin/users",
      count: stats.users
    },
    {
      title: "Installation Guides",
      description: "Manage product installation guides",
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      href: "/admin/installation-guides"
    },
    {
      title: "Durations",
      description: "Manage durations",
      icon: null,
      href: "/admin/durations"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardItems.map((item) => (
          <Link key={item.title} href={item.href} className="block">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              {item.icon && item.icon}
              {item.count !== undefined && (
                <p className="text-3xl font-bold text-primary">{item.count}</p>
              )}
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items[0]?.product?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.email || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const adminResult = await requireAdmin(context, '/client');
  
  if (adminResult.redirect) {
    return adminResult;
  }

  await dbConnect();

  const [categories, products, keys, users, orders] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    LicenseKey.countDocuments(),
    User.countDocuments(),
    Order.find()
      .populate('items.product', 'name')
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  return {
    props: {
      stats: {
        categories,
        products,
        keys,
        users,
      },
      recentOrders: JSON.parse(JSON.stringify(orders)),
    },
  };
}
