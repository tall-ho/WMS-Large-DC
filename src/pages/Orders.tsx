import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-mono uppercase tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 font-medium">Track and manage customer orders</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5722]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-bold tracking-wider text-left text-gray-500 uppercase border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 font-mono">Order ID</th>
                  <th className="px-6 py-4 font-mono">Customer</th>
                  <th className="px-6 py-4 font-mono">Total</th>
                  <th className="px-6 py-4 font-mono">Status</th>
                  <th className="px-6 py-4 font-mono">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{order.customerId}</td>
                    <td className="px-6 py-4 text-sm font-mono font-bold">${order.total}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className={`px-3 py-1 font-bold uppercase tracking-wide rounded-full text-[10px] ${
                        order.status === 'pending' ? 'text-orange-700 bg-orange-100' : 'text-green-700 bg-green-100'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
