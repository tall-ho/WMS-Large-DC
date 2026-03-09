import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendColor?: string;
  label?: string;
}

export default function KPICard({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  iconColor = "text-purple-600", 
  iconBg = "bg-purple-50",
  trend,
  trendColor = "text-green-600",
  label
}: KPICardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      
      <div className="mt-2">
        <h2 className="text-3xl font-bold text-gray-800 font-mono tracking-tight">{value}</h2>
        {subValue && (
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${trendColor === 'text-green-600' ? 'bg-green-500' : trendColor === 'text-red-500' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{subValue}</p>
          </div>
        )}
        {label && (
           <p className="text-[10px] text-gray-400 mt-2 font-medium">{label}</p>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
        <Icon className="w-32 h-32" />
      </div>
    </div>
  );
}
