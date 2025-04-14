import { requireAuth } from '../../../lib/auth';
import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export async function getServerSideProps(context) {
  await requireAuth(context.req, context.res, () => {});

  await dbConnect();

  const recentOrders = await Order.find({ user: context.req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('items.product', 'name');

  return {
    props: {
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    },
  };
}

export default function ClientDashboard({ recentOrders }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Order #{order._id}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {order.items.length} items • ${order.totalAmount}
                </div>
                <div className="text-sm">
                  Status: <span className="font-medium">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a
              href="/client/products"
              className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Browse Products
            </a>
            <a
              href="/client/orders"
              className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              View All Orders
            </a>
            <a
              href="/client/profile"
              className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Update Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 