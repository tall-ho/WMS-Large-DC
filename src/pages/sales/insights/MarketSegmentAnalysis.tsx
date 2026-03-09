import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Users } from 'lucide-react';

const salesBySegment = [
  { name: 'Modern Trade', value: 55 },
  { name: 'General Trade', value: 25 },
  { name: 'HORECA', value: 15 },
  { name: 'Online', value: 5 },
];

const COLORS = ['#FF5722', '#8E44AD', '#2ECC71', '#3498DB', '#F1C40F'];

export default function MarketSegmentAnalysis() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
          Market Segment Analysis
        </h1>
        <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">
          Customer Segmentation Overview
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-6">Segment Distribution</h3>
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesBySegment}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
                label
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
  );
}
