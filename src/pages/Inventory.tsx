import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-mono uppercase tracking-tight">Inventory</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time stock levels across warehouses</p>
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
                  <th className="px-6 py-4 font-mono">SKU</th>
                  <th className="px-6 py-4 font-mono">Product Name</th>
                  <th className="px-6 py-4 font-mono">Warehouse</th>
                  <th className="px-6 py-4 font-mono">On Hand</th>
                  <th className="px-6 py-4 font-mono">Reserved</th>
                  <th className="px-6 py-4 font-mono">Available</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#FF5722] font-medium">{item.sku}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.productName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="flex items-center text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                        {item.warehouseId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm font-mono text-orange-500">{item.reserved}</td>
                    <td className="px-6 py-4 text-sm font-mono text-green-600 font-bold">{item.available}</td>
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
