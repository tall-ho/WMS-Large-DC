import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { ShoppingBag, TrendingUp } from 'lucide-react';

const salesByCategory = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home & Garden', value: 300 },
  { name: 'Food & Beverage', value: 200 },
];

const COLORS = ['#FF5722', '#8E44AD', '#2ECC71', '#3498DB', '#F1C40F'];

// Grouped data for 5-Year Overview
const fiveYearData = [
  { 
    year: '2020', 
    Electronics: 1200000, 
    Clothing: 800000, 
    'Home & Garden': 600000, 
    'Food & Beverage': 400000,
    growth: 5 
  },
  { 
    year: '2021', 
    Electronics: 1350000, 
    Clothing: 900000, 
    'Home & Garden': 650000, 
    'Food & Beverage': 420000,
    growth: 12 
  },
  { 
    year: '2022', 
    Electronics: 1500000, 
    Clothing: 950000, 
    'Home & Garden': 700000, 
    'Food & Beverage': 450000,
    growth: 8 
  },
  { 
    year: '2023', 
    Electronics: 1800000, 
    Clothing: 1100000, 
    'Home & Garden': 850000, 
    'Food & Beverage': 500000,
    growth: 18 
  },
  { 
    year: '2024', 
    Electronics: 2100000, 
    Clothing: 1300000, 
    'Home & Garden': 950000, 
    'Food & Beverage': 600000,
    growth: 15 
  },
];

export default function SalesByCategory() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
          Sales by Category
        </h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
          Product Performance Analysis
        </p>
      </div>

      {/* 5-Year Overview Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">5-Year Sales Overview</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span>+75% Total Growth</span>
          </div>
        </div>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={fiveYearData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(value) => `฿${value/1000}k`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => [
                  name === 'growth' ? `${value}%` : `฿${value.toLocaleString()}`,
                  name === 'growth' ? 'Growth Rate' : name
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              
              <Bar yAxisId="left" dataKey="Electronics" fill={COLORS[0]} radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="Clothing" fill={COLORS[1]} radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="Home & Garden" fill={COLORS[2]} radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="Food & Beverage" fill={COLORS[3]} radius={[4, 4, 0, 0]} barSize={20} />
              
              <Line yAxisId="right" type="monotone" dataKey="growth" name="Growth Rate" stroke="#6B7280" strokeWidth={2} dot={{ r: 3, fill: '#6B7280', strokeWidth: 1, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Category Distribution</h3>
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
