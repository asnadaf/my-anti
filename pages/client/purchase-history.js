import { requireAuth } from '../../lib/auth';
import dbConnect from '../../lib/db';
import Order from '../../models/Order';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import SEO from '../../components/SEO';

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

  await dbConnect();
  const orders = await Order.find({ user: auth.userId })
    .populate('product', 'name slug')
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      orders: JSON.parse(JSON.stringify(orders)),
    },
  };
}

export default function PurchaseHistory({ orders }) {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Purchase History', path: '/client/purchase-history' },
  ];

  return (
    <>
      <SEO
        title="Purchase History"
        description="View your purchase history and order details"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Purchase History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You haven't made any purchases yet.
            </p>
            <Link href="/buyantivirus">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {order.product.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Order #{order._id}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold">${order.total}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <Link href={`/client/orders/${order._id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 