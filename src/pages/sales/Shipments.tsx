import { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Package, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  DollarSign, 
  BarChart2, 
  MoreHorizontal, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Download, 
  Printer,
  Navigation,
  Fuel,
  User,
  List
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// --- Types ---
interface Shipment {
  id: string;
  soNumber: string;
  customer: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Returned';
  driver: string;
  vehicle: string;
  date: string;
  items: number;
  weight: number;
}

interface TripRecord {
  id: string;
  date: string;
  vehicle: string;
  driver: string;
  route: string;
  distance: number;
  fuelCost: number;
  allowance: number;
  maintenance: number;
  totalCost: number;
  shipments: string[];
}

// --- Mock Data ---
const MOCK_SHIPMENTS: Shipment[] = [
  { id: 'SH-2026-001', soNumber: 'SO-2026-005', customer: 'SB Design Square', destination: 'Ratchapruk Warehouse', status: 'Delivered', driver: 'Somchai Jaidee', vehicle: '6-Wheel (81-1234)', date: '2026-01-25', items: 20, weight: 1500 },
  { id: 'SH-2026-002', soNumber: 'SO-2026-004', customer: 'Siam Furniture Dealer', destination: 'Bang Po Showroom', status: 'Delivered', driver: 'Wichai Meesuk', vehicle: 'Pickup (1Kor-5678)', date: '2026-01-18', items: 15, weight: 450 },
  { id: 'SH-2026-003', soNumber: 'SO-2026-001', customer: 'HomePro (Public Company)', destination: 'Rama 2 Branch', status: 'In Transit', driver: 'Somchai Jaidee', vehicle: '6-Wheel (81-1234)', date: '2026-01-20', items: 50, weight: 3200 },
  { id: 'SH-2026-004', soNumber: 'SO-2026-006', customer: 'Retail Customer B', destination: 'Ladprao', status: 'Returned', driver: 'Wichai Meesuk', vehicle: 'Pickup (1Kor-5678)', date: '2026-01-20', items: 1, weight: 50 },
  { id: 'SH-2026-005', soNumber: 'SO-2026-005', customer: 'SB Design Square', destination: 'Ratchapruk Warehouse', status: 'Pending', driver: '-', vehicle: '-', date: '2026-02-01', items: 40, weight: 2800 },
];

const MOCK_TRIP_RECORDS: TripRecord[] = [
  { id: 'TR-2026-001', date: '2026-01-18', vehicle: 'Pickup (1Kor-5678)', driver: 'Wichai Meesuk', route: 'Factory -> Bang Po -> Factory', distance: 45, fuelCost: 500, allowance: 300, maintenance: 0, totalCost: 800, shipments: ['SH-2026-002'] },
  { id: 'TR-2026-002', date: '2026-01-20', vehicle: '6-Wheel (81-1234)', driver: 'Somchai Jaidee', route: 'Factory -> Rama 2 -> Factory', distance: 120, fuelCost: 2500, allowance: 500, maintenance: 0, totalCost: 3000, shipments: ['SH-2026-003'] },
  { id: 'TR-2026-003', date: '2026-01-25', vehicle: '6-Wheel (81-1234)', driver: 'Somchai Jaidee', route: 'Factory -> Ratchapruk -> Factory', distance: 80, fuelCost: 1800, allowance: 500, maintenance: 0, totalCost: 2300, shipments: ['SH-2026-001'] },
];

// --- Components ---
const SortableTh = ({ label, sortKey, currentSort, onSort }: { label: string, sortKey: string, currentSort: { key: string, dir: 'asc' | 'desc' }, onSort: (key: string) => void }) => (
  <th 
    className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#D4AF37] transition-colors border-b border-gray-100"
    onClick={() => onSort(sortKey)}
  >
    <div className="flex items-center gap-1">
      {label}
      <ArrowUpDown size={12} className={`transition-opacity ${currentSort.key === sortKey ? 'opacity-100 text-[#D4AF37]' : 'opacity-30'}`} />
    </div>
  </th>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) => (
  <div className="flex items-center gap-2">
    <button 
      onClick={() => onPageChange(currentPage - 1)} 
      disabled={currentPage === 1}
      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronLeft size={16} className="text-slate-600" />
    </button>
    <span className="text-xs font-bold text-slate-600">
      Page {currentPage} of {totalPages}
    </span>
    <button 
      onClick={() => onPageChange(currentPage + 1)} 
      disabled={currentPage === totalPages}
      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ChevronRight size={16} className="text-slate-600" />
    </button>
  </div>
);

export default function Shipments() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'log' | 'dashboard' | 'cost'>('log');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string, dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modals
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [showDeliveryRecordModal, setShowDeliveryRecordModal] = useState(false);

  // --- Computed ---
  const filteredShipments = useMemo(() => {
    let res = [...MOCK_SHIPMENTS];
    if (statusFilter !== 'All') res = res.filter(s => s.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(s => 
        s.soNumber.toLowerCase().includes(q) || 
        s.customer.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
      );
    }
    res.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.dir === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return res;
  }, [searchQuery, statusFilter, sortConfig]);

  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;

  const stats = useMemo(() => ({
    total: MOCK_SHIPMENTS.length,
    pending: MOCK_SHIPMENTS.filter(s => s.status === 'Pending').length,
    inTransit: MOCK_SHIPMENTS.filter(s => s.status === 'In Transit').length,
    delivered: MOCK_SHIPMENTS.filter(s => s.status === 'Delivered').length,
    avgCostPerTrip: Math.round(MOCK_TRIP_RECORDS.reduce((acc, r) => acc + r.totalCost, 0) / MOCK_TRIP_RECORDS.length || 0)
  }), []);

  // --- Actions ---
  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Returned': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F8F4]">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F8F4]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <Truck size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">DELIVERY</span> <span className="font-semibold">MANAGEMENT</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Logistics & Transportation</span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('log')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'log' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> SHIPMENT LOG
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'dashboard' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <BarChart2 size={14} /> DASHBOARD
          </button>
          <button onClick={() => setActiveTab('cost')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'cost' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <DollarSign size={14} /> COST ANALYSIS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="Total Shipments" value={stats.total} icon={Package} iconColor="text-blue-600" subValue="This Month" />
            <KPICard title="In Transit" value={stats.inTransit} icon={Truck} iconColor="text-orange-500" subValue="Active Deliveries" />
            <KPICard title="Delivered" value={stats.delivered} icon={CheckCircle} iconColor="text-green-600" subValue="Completed" />
            <KPICard title="Avg. Cost/Trip" value={`฿${stats.avgCostPerTrip.toLocaleString()}`} icon={DollarSign} iconColor="text-purple-600" subValue="Fuel & Allowance" />
          </div>

          {/* Content Area */}
          <div className="flex flex-col overflow-hidden min-h-[600px] px-8 pb-8">
            
            {/* Toolbar (Only for Log Tab) */}
            {activeTab === 'log' && (
              <div className="px-6 py-4 border-b border-gray-100/50 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 bg-white/40 backdrop-blur-sm rounded-t-2xl border-t border-x border-white/60">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:flex-1 lg:min-w-0 mr-auto flex-wrap">
                  <div className="relative w-full md:w-64 flex-shrink-0">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search SO / Customer / Driver..." 
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60 backdrop-blur-sm transition-colors font-mono" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)} 
                      className="bg-white/60 border border-gray-200/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] font-mono cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                  <button onClick={() => setShowDeliveryRecordModal(true)} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F1E1B]/10 text-[#1F1E1B] hover:bg-[#1F1E1B]/20 shadow-sm transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <FileText size={16} /> Record Trip
                  </button>
                  <button onClick={() => setShowNewShipmentModal(true)} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={16} /> New Shipment
                  </button>
                </div>
              </div>
            )}

            {/* Log View */}
            {activeTab === 'log' && (
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
                    <tr>
                      <SortableTh label="Shipment ID" sortKey="id" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh label="SO Number" sortKey="soNumber" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh label="Date" sortKey="date" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh label="Customer" sortKey="customer" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh label="Destination" sortKey="destination" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh label="Driver / Vehicle" sortKey="driver" currentSort={sortConfig} onSort={handleSort} />
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedShipments.map(shipment => (
                      <tr key={shipment.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">{shipment.id}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{shipment.soNumber}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{shipment.date}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-900">{shipment.customer}</td>
                        <td className="px-6 py-4 text-xs text-slate-600 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {shipment.destination}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          <div className="font-bold">{shipment.driver}</div>
                          <div className="text-[10px] text-slate-400">{shipment.vehicle}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-1.5 rounded bg-white border border-gray-200 hover:text-slate-900 hover:bg-gray-100 transition-colors opacity-60 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wide">Shipment Status Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Doughnut 
                        data={{
                          labels: ['Pending', 'In Transit', 'Delivered', 'Returned'],
                          datasets: [{
                            data: [stats.pending, stats.inTransit, stats.delivered, MOCK_SHIPMENTS.filter(s => s.status === 'Returned').length],
                            backgroundColor: ['#FCD34D', '#60A5FA', '#4ADE80', '#F87171'],
                            borderWidth: 0
                          }]
                        }}
                        options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wide">On-Time Delivery Performance</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Line 
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          datasets: [{
                            label: 'On-Time %',
                            data: [95, 92, 98, 94, 96, 99],
                            borderColor: '#4ADE80',
                            tension: 0.4,
                            fill: false
                          }]
                        }}
                        options={{ maintainAspectRatio: false, scales: { y: { min: 80, max: 100 } } }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Analysis View */}
            {activeTab === 'cost' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wide">Monthly Transport Cost</h3>
                  <div className="h-80">
                    <Bar 
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                          { label: 'Fuel', data: [12000, 15000, 11000, 14000, 16000, 13000], backgroundColor: '#FCD34D' },
                          { label: 'Allowance', data: [5000, 6000, 4500, 5500, 6500, 5000], backgroundColor: '#60A5FA' },
                          { label: 'Maintenance', data: [2000, 0, 0, 5000, 0, 1000], backgroundColor: '#F87171' }
                        ]
                      }}
                      options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }}
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Trip Records</h3>
                  </div>
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Driver</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Route</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Distance</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_TRIP_RECORDS.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-xs font-mono text-slate-600">{record.date}</td>
                          <td className="px-6 py-3 text-xs font-bold text-slate-900">{record.driver}</td>
                          <td className="px-6 py-3 text-xs text-slate-600">{record.route}</td>
                          <td className="px-6 py-3 text-xs font-mono text-slate-600 text-right">{record.distance} km</td>
                          <td className="px-6 py-3 text-xs font-mono font-bold text-[#BE123C] text-right">฿{record.totalCost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination (Log Tab Only) */}
            {activeTab === 'log' && (
              <div className="px-6 py-4 border-t border-gray-100/50 flex justify-between items-center bg-white/40 backdrop-blur-sm shrink-0">
                <div className="text-xs text-slate-500 font-bold font-mono">
                  Showing {paginatedShipments.length} of {filteredShipments.length} entries
                </div>
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Shipment Modal */}
      {showNewShipmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={() => setShowNewShipmentModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Create New Shipment</h3>
              <button onClick={() => setShowNewShipmentModal(false)}><X size={20} className="text-gray-400 hover:text-slate-900" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">SO Number</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Select SO..." /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label><input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Driver</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Select Driver..." /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Select Vehicle..." /></div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowNewShipmentModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase">Cancel</button>
              <button onClick={() => { setShowNewShipmentModal(false); Swal.fire('Success', 'Shipment Created', 'success'); }} className="px-6 py-2 bg-[#403C2A] text-white text-xs font-bold rounded-lg hover:bg-[#403C2A]/90 uppercase">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Record Modal */}
      {showDeliveryRecordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={() => setShowDeliveryRecordModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Record Trip Expense</h3>
              <button onClick={() => setShowDeliveryRecordModal(false)}><X size={20} className="text-gray-400 hover:text-slate-900" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label><input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Driver</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Factory -> Site A -> Factory" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Distance (km)</label><input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fuel Cost</label><input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Allowance</label><input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowDeliveryRecordModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase">Cancel</button>
              <button onClick={() => { setShowDeliveryRecordModal(false); Swal.fire('Success', 'Trip Recorded', 'success'); }} className="px-6 py-2 bg-[#403C2A] text-white text-xs font-bold rounded-lg hover:bg-[#403C2A]/90 uppercase">Save Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
