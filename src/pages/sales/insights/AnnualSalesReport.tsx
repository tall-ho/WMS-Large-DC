import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Download,
  Filter,
  DollarSign
} from 'lucide-react';
import KPICard from '../../../components/KPICard';

const monthlyData2024 = [
  { month: 'Jan', target: 1072223, salesLastYear: 340000, salesThisYear: 100 },
  { month: 'Feb', target: 1172222, salesLastYear: 2940000, salesThisYear: 0 },
  { month: 'Mar', target: 1272222, salesLastYear: 650000, salesThisYear: 35000 },
  { month: 'Apr', target: 1160000, salesLastYear: 0, salesThisYear: 50000 },
  { month: 'May', target: 1500000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Jun', target: 1675111, salesLastYear: 0, salesThisYear: 683224 },
  { month: 'Jul', target: 1069444, salesLastYear: 0, salesThisYear: 235000 },
  { month: 'Aug', target: 1224444, salesLastYear: 0, salesThisYear: 1500000 },
  { month: 'Sep', target: 378889, salesLastYear: 0, salesThisYear: 15000 },
  { month: 'Oct', target: 425667, salesLastYear: 0, salesThisYear: 170000 },
  { month: 'Nov', target: 375611, salesLastYear: 70000, salesThisYear: 100000 },
  { month: 'Dec', target: 499556, salesLastYear: 0, salesThisYear: 9952616 },
];

const monthlyData2023 = [
  { month: 'Jan', target: 900000, salesLastYear: 300000, salesThisYear: 340000 },
  { month: 'Feb', target: 950000, salesLastYear: 250000, salesThisYear: 2940000 },
  { month: 'Mar', target: 1000000, salesLastYear: 600000, salesThisYear: 650000 },
  { month: 'Apr', target: 1050000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'May', target: 1100000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Jun', target: 1150000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Jul', target: 1200000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Aug', target: 1250000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Sep', target: 1300000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Oct', target: 1350000, salesLastYear: 0, salesThisYear: 0 },
  { month: 'Nov', target: 1400000, salesLastYear: 50000, salesThisYear: 70000 },
  { month: 'Dec', target: 1500000, salesLastYear: 0, salesThisYear: 0 },
];

const tableRows = [
  { label: 'Target', key: 'target', format: (v: number) => v.toLocaleString() },
  { label: 'Sales Last Year', key: 'salesLastYear', format: (v: number) => v.toLocaleString() },
  { label: 'Sales This Year', key: 'salesThisYear', format: (v: number) => v.toLocaleString() },
  { label: '% YoY', key: 'yoy', format: (v: number) => `${v}%`, calculate: (d: any) => d.salesLastYear > 0 ? ((d.salesThisYear - d.salesLastYear) / d.salesLastYear * 100).toFixed(1) : 'N/A' },
];

export default function AnnualSalesReport() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const currentData = selectedYear === '2024' ? monthlyData2024 : monthlyData2023;
  const lastYear = selectedYear === '2024' ? '2023' : '2022';

  const totalSalesThisYear = currentData.reduce((acc, curr) => acc + curr.salesThisYear, 0);
  const totalSalesLastYear = currentData.reduce((acc, curr) => acc + curr.salesLastYear, 0);
  const totalTarget = currentData.reduce((acc, curr) => acc + curr.target, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
            Annual Sales Report
          </h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
            Year over Year Comparison • {selectedYear} vs {lastYear}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Year</span>
            <select 
              className="text-xs font-bold text-gray-800 bg-transparent border-none focus:ring-0 cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title={`Total Sales ${lastYear}`} 
          value={`฿${totalSalesLastYear.toLocaleString()}`} 
          subValue={`Avg: ฿${(totalSalesLastYear/12).toLocaleString(undefined, {maximumFractionDigits: 0})} / Month`}
          trend="neutral"
          trendColor="text-green-600"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <KPICard 
          title={`Target ${selectedYear}`} 
          value={`฿${totalTarget.toLocaleString()}`} 
          subValue="Goal for Fiscal Year"
          trend="neutral"
          trendColor="text-blue-600"
          icon={Target}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard 
          title={`Total Sales ${selectedYear} (YTD)`} 
          value={`฿${totalSalesThisYear.toLocaleString()}`} 
          subValue={`Avg: ฿${(totalSalesThisYear/12).toLocaleString(undefined, {maximumFractionDigits: 0})} / Month`}
          trend="up"
          trendColor="text-gray-800"
          icon={TrendingUp}
          iconColor="text-gray-800"
          iconBg="bg-gray-100"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Sales Performance Trend</h3>
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded-full"></div>
              <span className="text-gray-600">Target {selectedYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="text-gray-600">Sales {lastYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span className="text-gray-600">Sales {selectedYear}</span>
            </div>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(value) => `฿${value/1000000}M`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => `฿${value.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="target" fill="#dcfce7" stroke="#86efac" strokeWidth={2} fillOpacity={0.5} name={`Target ${selectedYear}`} />
              <Line type="monotone" dataKey="salesLastYear" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} name={`Sales ${lastYear}`} />
              <Line type="monotone" dataKey="salesThisYear" stroke="#1f2937" strokeWidth={3} dot={{ r: 4 }} name={`Sales ${selectedYear}`} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Detailed Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                <th className="px-6 py-4 sticky left-0 bg-gray-50 z-10">Metric</th>
                {currentData.map(d => (
                  <th key={d.month} className="px-4 py-4 text-right">{d.month}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableRows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                  <td className="px-6 py-4 font-bold text-gray-700 sticky left-0 bg-inherit z-10 border-r border-gray-100">
                    {row.label}
                  </td>
                  {currentData.map(d => {
                    let value;
                    if (row.calculate) {
                      value = row.calculate(d);
                    } else {
                      // @ts-ignore
                      value = row.format(d[row.key]);
                    }
                    
                    const isNegative = typeof value === 'string' && value.includes('-') && row.key === 'yoy';
                    const isPositive = typeof value === 'string' && !value.includes('-') && value !== 'N/A' && row.key === 'yoy';

                    return (
                      <td key={d.month} className={`px-4 py-4 text-right font-mono ${isNegative ? 'text-red-500' : isPositive ? 'text-green-600' : 'text-gray-600'}`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
