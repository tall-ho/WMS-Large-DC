import ThailandMap from '../../../components/ThailandMap';
import { MapPin } from 'lucide-react';

const salesByRegion = [
  { name: 'Central', sales: 1200000 },
  { name: 'North', sales: 800000 },
  { name: 'North-East', sales: 950000 },
  { name: 'East', sales: 600000 },
  { name: 'South', sales: 400000 },
  { name: 'West', sales: 200000 },
];

export default function SalesByRegion() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
          Sales by Region
        </h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
          Geographic Performance Map
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Thailand Sales Heatmap</h3>
        <div className="h-[600px] flex items-center justify-center bg-gray-50/30 rounded-xl border border-gray-100/50">
          <ThailandMap data={salesByRegion} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
