import Link from 'next/link';
import { Home, Package, ShoppingCart, Truck, Users, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
      <h2 className="text-3xl font-semibold text-gray-800">WMS SaaS</h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <Link href="/dashboard" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <Home className="w-5 h-5" />
            <span className="mx-4 font-medium">Dashboard</span>
          </Link>

          <Link href="/products" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <Package className="w-5 h-5" />
            <span className="mx-4 font-medium">Products</span>
          </Link>

          <Link href="/inventory" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <ShoppingCart className="w-5 h-5" />
            <span className="mx-4 font-medium">Inventory</span>
          </Link>

          <Link href="/orders" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <Truck className="w-5 h-5" />
            <span className="mx-4 font-medium">Orders</span>
          </Link>

          <Link href="/users" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <Users className="w-5 h-5" />
            <span className="mx-4 font-medium">Users</span>
          </Link>
        </nav>

        <div className="flex items-center px-4 -mx-2">
           <Link href="/login" className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700">
            <LogOut className="w-5 h-5" />
            <span className="mx-4 font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
