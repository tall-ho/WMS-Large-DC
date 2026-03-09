import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MapPin, 
  Calendar,
  Filter
} from 'lucide-react';

import ThailandMap from '../../components/ThailandMap';

// Mock Data
const salesByRep = [
  { name: 'Somchai', sales: 450000, orders: 45 },
  { name: 'Nida', sales: 380000, orders: 38 },
  { name: 'David', sales: 320000, orders: 32 },
  { name: 'Sarah', sales: 290000, orders: 29 },
  { name: 'Mike', sales: 250000, orders: 25 },
];

const salesByCategory = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home & Garden', value: 300 },
  { name: 'Food & Beverage', value: 200 },
];

const salesBySegment = [
  { name: 'Modern Trade', value: 55 },
  { name: 'General Trade', value: 25 },
  { name: 'HORECA', value: 15 },
  { name: 'Online', value: 5 },
];

const salesByRegion = [
  { name: 'Central', sales: 1200000 },
  { name: 'North', sales: 800000 },
  { name: 'North-East', sales: 950000 },
  { name: 'East', sales: 600000 },
  { name: 'South', sales: 400000 },
  { name: 'West', sales: 200000 },
];

const COLORS = ['#FF5722', '#8E44AD', '#2ECC71', '#3498DB', '#F1C40F'];

export default function BusinessInsights() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
            Business Insights
          </h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
            Sales Performance Analytics • Real-time Data
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" />
            This Month
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InsightCard 
          title="Total Revenue" 
          value="฿3.2M" 
          trend="+15%" 
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          color="bg-green-100"
        />
        <InsightCard 
          title="Top Sales Rep" 
          value="Somchai" 
          trend="฿450k" 
          icon={<Users className="w-5 h-5 text-blue-600" />}
          color="bg-blue-100"
        />
        <InsightCard 
          title="Best Category" 
          value="Electronics" 
          trend="40%" 
          icon={<ShoppingBag className="w-5 h-5 text-purple-600" />}
          color="bg-purple-100"
        />
        <InsightCard 
          title="Top Region" 
          value="Central" 
          trend="38%" 
          icon={<MapPin className="w-5 h-5 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales by Rep */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Sales by Representative</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByRep} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" fill="#FF5722" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Region */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Sales by Region (Thailand)</h3>
          <div className="h-[400px] flex items-center justify-center bg-gray-50/30 rounded-xl border border-gray-100/50">
            <ThailandMap data={salesByRegion} className="w-full h-full" />
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Sales by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
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

        {/* Sales by Segment */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Market Segment Analysis</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesBySegment}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesBySegment.map((entry, index) => (
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
    </div>
  );
}

function InsightCard({ title, value, trend, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 font-mono tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
