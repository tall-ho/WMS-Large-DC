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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Filter, 
  Download,
  DollarSign,
  FileText,
  Users,
  UserPlus
} from 'lucide-react';
import KPICard from '../../components/KPICard';

// Mock Data
const topSellingProducts = [
  { name: 'Product A', value: 10.4 },
  { name: 'Product B', value: 10.4 },
  { name: 'Product C', value: 10.4 },
  { name: 'Product D', value: 10.4 },
  { name: 'Product E', value: 10.4 },
];

const topCustomers = [
  { name: 'Company A', received: 40, ar: 20, quotation: 10 },
  { name: 'Company B', received: 35, ar: 15, quotation: 10 },
  { name: 'Company C', received: 30, ar: 15, quotation: 10 },
  { name: 'Company D', received: 25, ar: 15, quotation: 10 },
  { name: 'Company E', received: 20, ar: 10, quotation: 10 },
  { name: 'Company F', received: 18, ar: 10, quotation: 10 },
  { name: 'Company G', received: 15, ar: 10, quotation: 10 },
];

const salesTrend = [
  { month: 'Jan', lastYear: 150, thisYear: 200, growth: 20 },
  { month: 'Feb', lastYear: 180, thisYear: 220, growth: 25 },
  { month: 'Mar', lastYear: 200, thisYear: 250, growth: 30 },
  { month: 'Apr', lastYear: 220, thisYear: 280, growth: 35 },
  { month: 'May', lastYear: 250, thisYear: 300, growth: 40 },
  { month: 'Jun', lastYear: 280, thisYear: 320, growth: 45 },
];

const topBrands = [
  { name: 'Brand A', value: 45 },
  { name: 'Brand B', value: 27 },
  { name: 'Brand C', value: 12 },
  { name: 'Brand D', value: 10 },
  { name: 'Brand E', value: 6 },
];

const salesPerformance = [
  { name: 'Team A', needImprovement: 10, satisfy: 20, veryGood: 70 },
  { name: 'Team B', needImprovement: 5, satisfy: 15, veryGood: 80 },
  { name: 'Team C', needImprovement: 15, satisfy: 25, veryGood: 60 },
  { name: 'Team D', needImprovement: 20, satisfy: 30, veryGood: 50 },
];

const COLORS = ['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'];
const BRAND_COLORS = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

export default function SalesOverview() {
  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
            Sales Overview
          </h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
            Customer: MTD Sales Overview
          </p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Category: Lens</option>
          </select>
          <select className="bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Month: May 2021</option>
          </select>
          <select className="bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Salesperson: Somchai</option>
          </select>
          <select className="bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Area: BKK</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue (Total)" 
          value="24,344,531" 
          subValue="21% MOM"
          trend="up"
          trendColor="text-green-600"
          icon={DollarSign}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          label="81% of Target"
        />
        <KPICard 
          title="# of Invoice" 
          value="28,550" 
          subValue="5% MOM"
          trend="down"
          trendColor="text-red-600"
          icon={FileText}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          label="121% of Target"
        />
        <KPICard 
          title="# of Customer Bought" 
          value="153" 
          subValue="10% MOM"
          trend="up"
          trendColor="text-green-600"
          icon={Users}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          label="98% of Target"
        />
        <KPICard 
          title="# New Customer" 
          value="22" 
          subValue="5% MOM"
          trend="down"
          trendColor="text-red-600"
          icon={UserPlus}
          iconColor="text-pink-600"
          iconBg="bg-pink-50"
          label="101% of Target"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Top Selling Products</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topSellingProducts} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#003f5c" radius={[0, 4, 4, 0]} barSize={20}>
                    <div className="text-xs text-white">10.4 MB</div>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Brands */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Top Selling Brands</h3>
            <div className="h-[250px] flex">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topBrands}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topBrands.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
           {/* Top 10 Customers */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Top 10 Customers</h3>
            <div className="h-[560px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topCustomers} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="received" name="Received" stackId="a" fill="#48c9b0" radius={[0, 0, 0, 0]} barSize={20} />
                  <Bar dataKey="ar" name="AR" stackId="a" fill="#e74c3c" radius={[0, 0, 0, 0]} barSize={20} />
                  <Bar dataKey="quotation" name="Quotation" stackId="a" fill="#ecf0f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          {/* Sales Trend */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Sales Trend</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar yAxisId="left" dataKey="lastYear" name="Last Year" fill="#95a5a6" barSize={10} radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="thisYear" name="This Year" fill="#34495e" barSize={10} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="growth" name="YoY Growth" stroke="#bdc3c7" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Performance */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Sales Performance</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={salesPerformance} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="needImprovement" name="Need Improvement" stackId="a" fill="#e74c3c" radius={[0, 0, 0, 0]} barSize={20} />
                  <Bar dataKey="satisfy" name="Satisfy" stackId="a" fill="#f1c40f" radius={[0, 0, 0, 0]} barSize={20} />
                  <Bar dataKey="veryGood" name="Very Good" stackId="a" fill="#1abc9c" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
