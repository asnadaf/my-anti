import { requireAuth, requireRole } from '@lib/auth';
import dbConnect from '@lib/db';
import Category from '@models/Category';
import Product from '@models/Product';
import LicenseKey from '@models/LicenseKey';
import User from '@models/User';
import Order from '@models/Order';

export async function getServerSideProps(context) {
  await requireAuth(context.req, context.res, () => {});
  await requireRole(['admin'])(context.req, context.res, () => {});

  await dbConnect();

  const [
    categoriesCount,
    productsCount,
    keysCount,
    usersCount,
    recentOrders,
  ] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    LicenseKey.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'email'),
  ]);

  return {
    props: {
      stats: {
        categories: categoriesCount,
        products: productsCount,
        keys: keysCount,
        users: usersCount,
      },
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    },
  };
}

export default function AdminDashboard({ stats, recentOrders }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">License Keys</h3>
          <p className="text-3xl font-bold">{stats.keys}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.user.email}</td>
                  <td className="px-4 py-2">${order.totalAmount}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">
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