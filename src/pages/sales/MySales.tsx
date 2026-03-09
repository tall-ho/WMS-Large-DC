import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  DollarSign
} from 'lucide-react';
import KPICard from '../../components/KPICard';

// Mock Data for Individual Sales Rep
const mySalesData2024 = [
  { month: 'Jan', target: 100000, actual: 85000 },
  { month: 'Feb', target: 100000, actual: 92000 },
  { month: 'Mar', target: 100000, actual: 105000 },
  { month: 'Apr', target: 100000, actual: 98000 },
  { month: 'May', target: 120000, actual: 115000 },
  { month: 'Jun', target: 120000, actual: 125000 },
  { month: 'Jul', target: 120000, actual: 118000 },
  { month: 'Aug', target: 120000, actual: 130000 },
  { month: 'Sep', target: 150000, actual: 142000 },
  { month: 'Oct', target: 150000, actual: 155000 },
  { month: 'Nov', target: 150000, actual: 148000 },
  { month: 'Dec', target: 180000, actual: 190000 },
];

const mySalesData2023 = [
  { month: 'Jan', target: 90000, actual: 88000 },
  { month: 'Feb', target: 90000, actual: 95000 },
  { month: 'Mar', target: 90000, actual: 92000 },
  { month: 'Apr', target: 90000, actual: 100000 },
  { month: 'May', target: 100000, actual: 105000 },
  { month: 'Jun', target: 100000, actual: 98000 },
  { month: 'Jul', target: 100000, actual: 110000 },
  { month: 'Aug', target: 100000, actual: 115000 },
  { month: 'Sep', target: 120000, actual: 125000 },
  { month: 'Oct', target: 120000, actual: 130000 },
  { month: 'Nov', target: 120000, actual: 135000 },
  { month: 'Dec', target: 150000, actual: 160000 },
];

const recentTransactions = [
  { id: 'ORD-001', customer: 'Siam Paragon', amount: 45000, date: '2024-03-01', status: 'Completed' },
  { id: 'ORD-002', customer: 'Central World', amount: 32000, date: '2024-03-02', status: 'Processing' },
  { id: 'ORD-003', customer: 'Icon Siam', amount: 28000, date: '2024-03-03', status: 'Pending' },
  { id: 'ORD-004', customer: 'EmQuartier', amount: 15000, date: '2024-03-04', status: 'Completed' },
  { id: 'ORD-005', customer: 'Terminal 21', amount: 12000, date: '2024-03-05', status: 'Shipped' },
];

export default function MySales() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const currentData = selectedYear === '2024' ? mySalesData2024 : mySalesData2023;

  const totalTarget = currentData.reduce((acc, curr) => acc + curr.target, 0);
  const totalActual = currentData.reduce((acc, curr) => acc + curr.actual, 0);
  const achievement = (totalActual / totalTarget) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
            My Sales Dashboard
          </h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
            Personal Performance Tracker • {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Fiscal Year</span>
          <select 
            className="text-xs font-bold text-gray-800 bg-transparent border-none focus:ring-0 cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="My Annual Target" 
          value={`฿${totalTarget.toLocaleString()}`} 
          subValue={`Goal for ${selectedYear}`}
          trend="neutral"
          trendColor="text-blue-600"
          icon={Target}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard 
          title="Actual Sales (YTD)" 
          value={`฿${totalActual.toLocaleString()}`} 
          subValue="Total Revenue"
          trend="up"
          trendColor="text-green-600"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <KPICard 
          title="Achievement" 
          value={`${achievement.toFixed(1)}%`} 
          subValue={achievement >= 100 ? "Target Met!" : "Keep Pushing!"}
          trend={achievement >= 100 ? "up" : "neutral"}
          trendColor={achievement >= 100 ? "text-purple-600" : "text-orange-600"}
          icon={Award}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Monthly Performance vs Target</h3>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(value) => `฿${value/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => `฿${value.toLocaleString()}`}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="actual" name="Actual Sales" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={30} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Recent Transactions</h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-700">{tx.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{tx.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-700">฿{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      tx.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.status}
                    </span>
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
