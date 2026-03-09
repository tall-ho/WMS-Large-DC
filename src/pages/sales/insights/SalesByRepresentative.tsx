import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Users } from 'lucide-react';

const salesByRep = [
  { name: 'Somchai', sales: 450000, orders: 45 },
  { name: 'Nida', sales: 380000, orders: 38 },
  { name: 'David', sales: 320000, orders: 32 },
  { name: 'Sarah', sales: 290000, orders: 29 },
  { name: 'Mike', sales: 250000, orders: 25 },
];

export default function SalesByRepresentative() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
          Sales by Representative
        </h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
          Individual Performance Metrics
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Top Performers</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByRep} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} width={80} />
              <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="sales" fill="#FF5722" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
