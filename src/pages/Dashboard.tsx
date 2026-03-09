import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  AlertTriangle, 
  Box, 
  Truck, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Layout,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Chart Data
const movementData = [
  { name: 'Mon', inbound: 40, outbound: 24 },
  { name: 'Tue', inbound: 30, outbound: 13 },
  { name: 'Wed', inbound: 20, outbound: 58 },
  { name: 'Thu', inbound: 27, outbound: 39 },
  { name: 'Fri', inbound: 18, outbound: 48 },
  { name: 'Sat', inbound: 23, outbound: 38 },
  { name: 'Sun', inbound: 34, outbound: 43 },
];

const storageData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 300 },
  { name: 'Others', value: 200 },
];

const COLORS = ['#FF5722', '#8E44AD', '#2ECC71', '#3498DB'];

// Mock Data
const recentReceiving = [
  {
    id: '1',
    name: 'RM-SUGAR-001',
    description: 'Refined Sugar 50kg',
    status: 'RECEIVED',
    type: 'Inbound GR',
    time: '10:30 AM',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '2',
    name: 'FG-MILK-012',
    description: 'Fresh Milk 1L',
    status: 'PENDING PUTAWAY',
    type: 'Staging Area',
    time: '11:15 AM',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '3',
    name: 'PM-BOX-005',
    description: 'Corrugated Box L',
    status: 'PICKED',
    type: 'Outbound',
    time: '11:45 AM',
    image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=200&q=80'
  }
];

const pendingTasks = [
  {
    id: '1',
    title: 'Inbound Dock 2',
    subtitle: 'GR APPROVAL • MISSING DOCUMENTS',
    ref: 'GR-2026-003',
    status: 'PENDING',
    icon: AlertTriangle
  },
  {
    id: '2',
    title: 'Warehouse Manager',
    subtitle: 'STOCK ADJUSTMENT • LOT FG-012',
    ref: 'ADJ-2026-015',
    status: 'IN REVIEW',
    icon: FileText
  },
  {
    id: '3',
    title: 'Logistics Dept',
    subtitle: 'ROUTE UPDATE • NEW DELIVERY',
    ref: 'RT-2026-002',
    status: 'PROCESSING',
    icon: Truck
  }
];

const stockAlerts = [
  {
    id: '1',
    type: 'OUT_OF_STOCK',
    item: 'RM-FLOUR-002',
    message: 'Stock level at 0. Reorder immediately.',
    severity: 'critical'
  },
  {
    id: '2',
    type: 'NEAR_EXPIRY',
    item: 'FG-YOGURT-005',
    message: 'Expires in 3 days. Prioritize picking.',
    severity: 'warning'
  },
  {
    id: '3',
    type: 'OUT_OF_STOCK',
    item: 'PK-LABEL-001',
    message: 'Packaging labels depleted.',
    severity: 'critical'
  },
  {
    id: '4',
    type: 'NEAR_EXPIRY',
    item: 'RM-YEAST-003',
    message: 'Expires in 5 days. Check batch #882.',
    severity: 'warning'
  },
  {
    id: '5',
    type: 'OUT_OF_STOCK',
    item: 'RM-SUGAR-005',
    message: 'Stock below safety level.',
    severity: 'critical'
  },
  {
    id: '6',
    type: 'NEAR_EXPIRY',
    item: 'FG-CHEESE-002',
    message: 'Expires in 7 days. Move to front.',
    severity: 'warning'
  }
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight uppercase font-mono">
            SAWASDEE, <span className="text-gray-600">WMS TEAM!</span>
          </h1>
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs tracking-widest mt-1 uppercase">
            SMART WAREHOUSE HUB <span className="text-gray-300">•</span> OPERATIONS ACTIVE
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
            <Layout className="w-4 h-4" />
            Facility Overview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D32F2F] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#B71C1C] transition-colors shadow-sm">
            <AlertCircle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
        <div className="absolute inset-0 bg-gray-900/80 z-10 transition-opacity group-hover:bg-gray-900/70"></div>
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80" 
          alt="Warehouse" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-10">
          <div className="w-1 h-12 bg-orange-500 mb-4"></div>
          <h2 className="text-4xl font-bold text-white tracking-widest font-mono mb-2">EFFICIENCY FIRST</h2>
          <p className="text-gray-300 italic max-w-xl text-lg font-light">
            "A well-organized warehouse is the foundation of a successful supply chain."
          </p>
          <div className="mt-4">
            <span className="bg-orange-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">WMS MASTER</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="TOTAL ITEMS" 
          value="12,450" 
          icon={<Box className="w-6 h-6 text-purple-500" />} 
          footerLabel="TODAY"
          footerColor="bg-purple-500"
        />
        <StatCard 
          title="ACCURACY RATE" 
          value="99.8%" 
          icon={<CheckCircle2 className="w-6 h-6 text-purple-500" />} 
          footerLabel="INVENTORY SCORE"
          footerColor="bg-purple-800"
        />
        <StatCard 
          title="PENDING PUTAWAY" 
          value="45" 
          valueColor="text-orange-500"
          icon={<Clock className="w-6 h-6 text-orange-500" />} 
          footerLabel="PALLETS WAITING"
          footerColor="bg-orange-500"
        />
        <StatCard 
          title="ACTIVE ALERTS" 
          value="3" 
          valueColor="text-red-500"
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />} 
          footerLabel="REQUIRES ACTION"
          footerColor="bg-red-500"
        />
      </div>

      {/* Stock Alerts Board */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Stock Alerts Board</h3>
              <p className="text-xs text-gray-500 font-medium">Critical Inventory Issues & Expirations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
              {stockAlerts.length} Issues
            </span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Out of Stock Alerts */}
          <div className="rounded-xl border border-red-100 overflow-hidden flex flex-col bg-white">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-bold text-red-800 uppercase tracking-wide">Out of Stock</h4>
              </div>
              <span className="bg-white text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                {stockAlerts.filter(a => a.type === 'OUT_OF_STOCK').length} Items
              </span>
            </div>
            <div className="p-3 flex-1 bg-red-50/30">
              {stockAlerts.filter(a => a.type === 'OUT_OF_STOCK').length > 0 ? (
                <div className="space-y-2">
                  {stockAlerts.filter(a => a.type === 'OUT_OF_STOCK').map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-white hover:shadow-sm transition-shadow group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-bold text-sm text-gray-800 truncate pr-2">{alert.item}</h4>
                          <button className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">
                            Restock
                          </button>
                        </div>
                        <p className="text-xs text-red-600/80 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6">
                  <CheckCircle2 className="w-6 h-6 mb-2 text-green-500/50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">All Stock Levels Normal</p>
                </div>
              )}
            </div>
          </div>

          {/* Near Expiry Alerts */}
          <div className="rounded-xl border border-orange-100 overflow-hidden flex flex-col bg-white">
            <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wide">Near Expiry</h4>
              </div>
              <span className="bg-white text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
                {stockAlerts.filter(a => a.type === 'NEAR_EXPIRY').length} Items
              </span>
            </div>
            <div className="p-3 flex-1 bg-orange-50/30">
              {stockAlerts.filter(a => a.type === 'NEAR_EXPIRY').length > 0 ? (
                <div className="space-y-2">
                  {stockAlerts.filter(a => a.type === 'NEAR_EXPIRY').map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-orange-100 bg-white hover:shadow-sm transition-shadow group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-bold text-sm text-gray-800 truncate pr-2">{alert.item}</h4>
                          <button className="text-[10px] font-bold uppercase tracking-wider text-orange-600 hover:text-orange-800 bg-orange-50 px-2 py-1 rounded hover:bg-orange-100 transition-colors">
                            Inspect
                          </button>
                        </div>
                        <p className="text-xs text-orange-600/80 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6">
                  <CheckCircle2 className="w-6 h-6 mb-2 text-green-500/50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Expiry Alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Receiving (Replacing Recent Transactions) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Recent Receiving</h3>
              <p className="text-xs text-gray-500 font-medium">Latest Inbound Activities</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Live Updates
            </span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReceiving.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-2 right-2 p-1.5 bg-orange-500 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-800 font-mono text-lg">{item.name}</h4>
                <p className="text-xs text-green-600 font-bold uppercase tracking-wider mt-1 mb-2">{item.status}</p>
                <p className="text-sm text-gray-500 mb-4">{item.type}</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs font-mono text-gray-400 uppercase">
                  <span>Time</span>
                  <span className="font-bold text-gray-600">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Movement */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Weekly Movement</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">INBOUND VS OUTBOUND VOLUME</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Inbound
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> Outbound
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5722" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF5722" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8E44AD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8E44AD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'monospace' }}
                  cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="inbound" stroke="#FF5722" strokeWidth={3} fillOpacity={1} fill="url(#colorInbound)" />
                <Area type="monotone" dataKey="outbound" stroke="#8E44AD" strokeWidth={3} fillOpacity={1} fill="url(#colorOutbound)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-1">Storage Usage</h3>
          <p className="text-xs text-gray-500 font-mono mb-6">CAPACITY DISTRIBUTION</p>
          
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">85%</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Occupied</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {storageData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Tasks & System Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Pending Tasks</h3>
                  <p className="text-xs text-gray-500 font-medium">Operational Action Items</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {pendingTasks.length} Tasks
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-orange-100 group-hover:bg-orange-50 transition-colors">
                    <task.icon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 font-mono text-base">{task.title}</h4>
                      <span className="text-xs font-bold text-red-500 font-mono">{task.ref}</span>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{task.subtitle}</p>
                  </div>
                  <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:bg-orange-100 group-hover:text-orange-600 group-hover:border-orange-200 transition-all">
                    {task.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alert */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">System Alert</h3>
                  <p className="text-xs text-gray-500 font-medium">Critical Notifications</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-2 mb-2 text-red-600 font-bold uppercase tracking-wider text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  Server Maintenance
                </div>
                <p className="text-xs text-red-800 leading-relaxed font-mono">
                  Database optimization starts Sunday 2:00 AM. Ensure all offline syncs are completed.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold uppercase tracking-wider text-xs">
                  <Box className="w-4 h-4" />
                  New Feature Update
                </div>
                <p className="text-xs text-purple-800 leading-relaxed font-mono">
                  Barcode scanning via mobile app is now available. Please review the updated manual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, footerLabel, footerColor, valueColor = 'text-gray-800' }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          {icon}
        </div>
      </div>
      <div>
        <h3 className={`text-4xl font-bold ${valueColor} tracking-tighter`}>{value}</h3>
        <div className="flex items-center gap-2 mt-3">
          <span className={`w-2 h-2 rounded-full ${footerColor}`}></span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{footerLabel}</span>
        </div>
      </div>
    </div>
  );
}
