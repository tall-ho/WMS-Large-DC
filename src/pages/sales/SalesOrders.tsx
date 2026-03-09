import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  ShoppingBag,
  Clock,
  MapPin,
  List,
  Kanban,
  BarChart2,
  UploadCloud,
  Eye,
  Printer,
  Check,
  Hammer,
  PackageCheck,
  Truck,
  CheckCircle,
  AlertTriangle,
  X,
  Info,
  ShoppingCart,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';

// --- Types ---
interface OrderItem {
  name: string;
  qty: number;
  price: number;
  deliveries?: { date: string; qty: number; destination: string }[];
}

interface Order {
  id: number | string;
  soNumber: string;
  date: string;
  customer: string;
  destination: string;
  status: string;
  total: number;
  vatType: string;
  items: OrderItem[];
  deliveryStatus?: string;
  shippedQty?: number;
  totalQty?: number;
}

// --- Mock Data ---
const MOCK_ORDERS: Order[] = [
  { id: 1, soNumber: 'SO-2026-001', date: '2026-01-10', customer: 'HomePro (Public Company)', destination: 'Rama 2 Branch', status: 'Production', total: 450000, vatType: 'Excl.', items: [{name: 'Item A', qty: 50, price: 9000, deliveries: [{date: '2026-01-20', qty: 50, destination: 'Rama 2'}]}, {name: 'Item B', qty: 20, price: 0}] },
  { id: 2, soNumber: 'SO-2026-002', date: '2026-01-12', customer: 'Index Living Mall', destination: 'Bangna Head Office', status: 'JO Created', total: 320000, vatType: 'Incl.', items: [{name: 'Item C', qty: 100, price: 3200}] },
  { id: 3, soNumber: 'SO-2026-003', date: '2026-01-15', customer: 'Origin Condo Project', destination: 'Sukhumvit 24 Site', status: 'Booking', total: 890000, vatType: 'Excl.', items: [{name: 'Item D', qty: 10, price: 89000}, {name: 'Item E', qty: 5, price: 0}, {name: 'Item F', qty: 20, price: 0}] },
  { id: 4, soNumber: 'SO-2026-004', date: '2026-01-16', customer: 'Siam Furniture Dealer', destination: 'Bang Po Showroom', status: 'Delivered', total: 120000, vatType: 'No VAT', items: [{name: 'Item G', qty: 15, price: 8000}] },
  { id: 5, soNumber: 'SO-2026-005', date: '2026-01-18', customer: 'SB Design Square', destination: 'Ratchapruk Warehouse', status: 'Ready to Ship', total: 560000, vatType: 'Incl.', deliveryStatus: 'Partial', shippedQty: 20, totalQty: 60, items: [{name: 'Item H', qty: 60, price: 9333, deliveries: [{date: '2026-01-25', qty: 20, destination: 'Ratchapruk'}, {date: '2026-02-01', qty: 40, destination: 'Ratchapruk'}]}] },
  { id: 6, soNumber: 'SO-2026-006', date: '2026-01-20', customer: 'Retail Customer B', destination: 'Ladprao', status: 'Returned', total: 15000, vatType: 'Incl.', items: [{name: 'Item I', qty: 1, price: 15000}] },
];

const STATUSES = ['All', 'Booking', 'JO Created', 'Production', 'Ready to Ship', 'Delivered', 'Returned'];
const DISPLAY_STATUSES = ['All', 'Booking', 'Production', 'Ready to Ship', 'Delivered'];

// --- Mock Data for Analytics ---
const SALES_TREND_DATA = [
  { month: 'Jan', sales: 450000 },
  { month: 'Feb', sales: 320000 },
  { month: 'Mar', sales: 550000 },
  { month: 'Apr', sales: 480000 },
  { month: 'May', sales: 600000 },
  { month: 'Jun', sales: 520000 },
];

const TOP_CUSTOMERS_DATA = [
  { name: 'HomePro', value: 1200000 },
  { name: 'Index', value: 980000 },
  { name: 'Origin', value: 850000 },
  { name: 'Siam Furn.', value: 600000 },
  { name: 'SB Design', value: 450000 },
];

export default function SalesOrders() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'list' | 'kanban' | 'analytics'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeModalTab, setActiveModalTab] = useState('Order Info');
  const [formData, setFormData] = useState<any>({
    customer: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Booking',
    paymentTerm: 'Cash',
    salesPerson: 'Admin',
    items: [{ name: '', qty: 1, price: 0, deliveries: [] }]
  });

  // --- Computed ---
  const filteredOrders = useMemo(() => {
    let res = orders;
    if (statusFilter !== 'All') res = res.filter(o => o.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(o => 
        o.soNumber.toLowerCase().includes(q) || 
        o.customer.toLowerCase().includes(q)
      );
    }
    return res;
  }, [orders, statusFilter, searchQuery]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'Booking').length,
    production: orders.filter(o => o.status === 'Production').length,
    completed: orders.filter(o => o.status === 'Delivered').length
  }), [orders]);

  // --- Actions ---
  const formatCurrency = (val: number) => '฿' + (val || 0).toLocaleString();

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Booking': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'JO Created': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Production': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Ready to Ship': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Returned': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getBoardItems = (status: string) => {
    let items = orders.filter(o => o.status === status);
    if (status === 'Delivered') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        items = items.filter(o => new Date(o.date) >= oneMonthAgo);
    }
    return items;
  };

  const updateSOStatus = (newStatus: string, id: number | string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    Swal.fire({ icon: 'success', title: 'Status Updated', text: `Order moved to ${newStatus}`, timer: 1000, showConfirmButton: false });
  };

  const openModal = (order: Order | null = null, mode: 'create' | 'edit' | 'view' = 'create') => {
    setModalMode(mode);
    setSelectedOrder(order);
    if (order) {
      setFormData(JSON.parse(JSON.stringify(order)));
    } else {
      setFormData({
        customer: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Booking',
        paymentTerm: 'Cash',
        salesPerson: 'Admin',
        items: [{ name: '', qty: 1, price: 0, deliveries: [] }]
      });
    }
    setActiveModalTab('Order Info');
    setShowModal(true);
  };

  const saveOrder = () => {
    if (modalMode === 'edit' && selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...formData, id: o.id, total: calculateTotal() } : o));
    } else {
      const newOrder = { 
        id: Date.now(), 
        soNumber: `SO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`, 
        ...formData, 
        total: calculateTotal() 
      };
      setOrders(prev => [newOrder, ...prev]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const deleteOrder = (id: number | string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BE123C',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(prev => prev.filter(o => o.id !== id));
        if (showModal) setShowModal(false);
        Swal.fire('Deleted!', 'Order has been deleted.', 'success');
      }
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((acc: number, item: any) => acc + (item.qty * item.price), 0);
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { name: '', qty: 1, price: 0, deliveries: [] }] });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const addDelivery = (itemIndex: number) => {
    const newItems = [...formData.items];
    if (!newItems[itemIndex].deliveries) newItems[itemIndex].deliveries = [];
    newItems[itemIndex].deliveries.push({ date: '', qty: 0, destination: '' });
    setFormData({ ...formData, items: newItems });
  };

  const removeDelivery = (itemIndex: number, deliveryIndex: number) => {
    const newItems = [...formData.items];
    newItems[itemIndex].deliveries.splice(deliveryIndex, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Swal.fire({
      title: 'Importing...',
      text: `File: ${file.name}`,
      timer: 2000,
      didOpen: () => Swal.showLoading()
    }).then(() => {
      setOrders(prev => [{ 
        id: Date.now(), 
        soNumber: 'SO-IMP-001', 
        date: new Date().toISOString().split('T')[0], 
        customer: 'Imported Customer', 
        destination: 'HQ',
        status: 'Booking', 
        total: 100000, 
        vatType: 'Excl.', 
        items: [{name: 'Imported Item', qty: 100, price: 1000}] 
      }, ...prev]);
      Swal.fire('Success', 'Orders imported successfully', 'success');
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-transparent">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">SALES</span> <span className="font-semibold">ORDER</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Order Management System</span>
            </p>
          </div>
        </div>
        
        {/* Main Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> ORDER LIST
          </button>
          <button onClick={() => setActiveTab('kanban')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'kanban' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Kanban size={14} /> KANBAN BOARD
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'analytics' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <BarChart2 size={14} /> ANALYTICS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full p-8 flex flex-col gap-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Total Orders" value={stats.totalOrders} iconColor="text-[#809BBF]" icon={FileText} subValue="All Records" />
            <KPICard title="Pending" value={stats.pending} iconColor="text-[#D4AF37]" icon={Clock} subValue="Wait for Action" />
            <KPICard title="In Production" value={stats.production} iconColor="text-[#3A3659]" icon={Hammer} subValue="Open JO" />
            <KPICard title="Completed" value={stats.completed} iconColor="text-[#3F6212]" icon={CheckCircle} subValue="Delivered" />
          </div>

          {/* Content Area */}
          <div className="bg-white/80  rounded-none shadow-sm border border-white/60 flex flex-col overflow-hidden min-h-[600px]">
            
            {/* Toolbar */}
            {activeTab === 'list' && (
              <div className="px-6 py-4 border-b border-gray-100/50 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 bg-white/40 ">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:flex-1 lg:min-w-0 mr-auto flex-wrap">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-fit p-1 bg-gray-100/60 rounded-xl border border-white/50  shrink-0">
                    {DISPLAY_STATUSES.map(status => (
                      <button 
                        key={status} 
                        onClick={() => setStatusFilter(status)} 
                        className={`flex items-center gap-1.5 capitalize font-mono px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === status ? 'bg-slate-500/60 text-white' : 'text-slate-500 hover:bg-white/50'}`}
                      >
                        <span>{status}</span>
                        <span className={`flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[9px] ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {orders.filter(o => status === 'All' || o.status === status).length}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-56 flex-shrink-0">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search SO No. / Customer..." 
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60  transition-colors font-mono" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                  <label className="cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F1E1B]/10 text-[#1F1E1B] hover:bg-[#1F1E1B]/20 shadow-sm transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <UploadCloud size={16} /> Upload
                    <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
                  </label>
                  <button onClick={() => openModal(null, 'create')} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={16} /> NEW ORDER
                  </button>
                </div>
              </div>
            )}

            {/* List View */}
            {activeTab === 'list' && (
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-gray-50/90 ">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono">SO Number</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono">Date</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono">Customer</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-center">Items</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-center">Delivery</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-center">VAT</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-right">Total Amount</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-center">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-900 uppercase tracking-wider border-b-2 border-[#D4AF37] font-mono text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedOrders.map(so => (
                      <tr key={so.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-xs text-slate-900">{so.soNumber}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{so.date}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 text-xs">{so.customer}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} className="text-slate-400" /> 
                            {so.destination || 'Main Warehouse'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs">{so.items.length} Items</span>
                            <span className="text-[10px] text-slate-500">{so.items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0).toLocaleString()} Units</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-mono text-gray-600">
                          <div className="flex flex-col gap-1 items-center">
                            {so.items.some(i => i.deliveries && i.deliveries.length > 0) ? (
                              Array.from(new Set(so.items.flatMap(i => i.deliveries || []).map(d => d.date).filter(d => d))).sort().slice(0, 2).map(d => (
                                <div key={d} className="flex items-center gap-1"><Clock size={10} className="text-slate-400" /> {d}</div>
                              ))
                            ) : (
                              <div className="flex items-center gap-1 text-[#B43B42] animate-pulse"><AlertTriangle size={10} /> TBD</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-500">{so.vatType}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#B43B42] text-xs font-mono">{formatCurrency(so.total)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusClass(so.status)}`}>{so.status}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(so, 'view')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-slate-900 hover:bg-gray-100 transition-colors" title="View">
                              <Eye size={14} />
                            </button>
                            <button className="p-1.5 rounded bg-white border border-gray-200 hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-colors" title="Print">
                              <Printer size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Kanban View */}
            {activeTab === 'kanban' && (
              <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 p-6 bg-gray-50/30">
                <div className="flex gap-6 h-full min-w-max">
                  {/* Columns */}
                  {[
                    { id: 'Booking', title: 'เปิดจองสินค้า (Booking)', color: 'bg-gray-400' },
                    { id: 'JO Created', title: 'เปิดใบสั่งผลิตแล้ว (JO Created)', color: 'bg-[#D1A915]' },
                    { id: 'Production', title: 'อยู่ระหว่างผลิต (In Production)', color: 'bg-[#BAB0C3]' },
                    { id: 'Ready to Ship', title: 'รอจัดส่ง (Ready to Ship)', color: 'bg-blue-400' },
                    { id: 'Delivered', title: 'ส่งมอบแล้ว (Delivered)', color: 'bg-[#AABAAB]' },
                    { id: 'Returned', title: 'เคลม/ส่งคืน (Returned)', color: 'bg-red-500' },
                  ].map(col => (
                    <div key={col.id} className="w-72 flex-shrink-0 flex flex-col h-full bg-white/40  rounded-xl p-3 border border-white shadow-sm">
                      <div className="flex justify-between items-center mb-3 px-1">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${col.color}`}></div> {col.title}
                        </h4>
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">
                          {getBoardItems(col.id).length}
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                        {getBoardItems(col.id).map(order => (
                          <div key={order.id} onClick={() => openModal(order, 'view')} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{order.soNumber}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{order.date}</span>
                            </div>
                            <h5 className="font-bold text-sm text-slate-900 mb-2">{order.customer}</h5>
                            <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                              <span className="text-xs font-bold text-slate-900">{formatCurrency(order.total)}</span>
                            </div>
                            
                            {/* Actions based on status */}
                            <div className="mt-3">
                              {col.id === 'Booking' && (
                                <button onClick={(e) => { e.stopPropagation(); updateSOStatus('JO Created', order.id); }} className="w-full bg-[#8EB1D1] hover:bg-[#8EB1D1]/90 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                                  <Check size={12} /> Confirm Order
                                </button>
                              )}
                              {col.id === 'JO Created' && (
                                <button onClick={(e) => { e.stopPropagation(); updateSOStatus('Production', order.id); }} className="w-full bg-[#D1A915] hover:bg-[#D1A915]/90 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                                  <Hammer size={12} /> Start Prod.
                                </button>
                              )}
                              {col.id === 'Production' && (
                                <button onClick={(e) => { e.stopPropagation(); updateSOStatus('Ready to Ship', order.id); }} className="w-full bg-[#BAB0C3] hover:bg-[#BAB0C3]/90 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                                  <PackageCheck size={12} /> QC Pass
                                </button>
                              )}
                              {col.id === 'Ready to Ship' && (
                                <button onClick={(e) => { e.stopPropagation(); updateSOStatus('Delivered', order.id); }} className="w-full bg-blue-400 hover:bg-blue-500 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                                  <Truck size={12} /> Ship
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Analytics View */}
            {activeTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <div className="bg-white/70  p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Sales Trend (Monthly)</h3>
                    <div className="flex-grow relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SALES_TREND_DATA}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(value) => `฿${value/1000}k`} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            itemStyle={{color: '#1F2937', fontSize: '12px', fontWeight: 'bold'}}
                            formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Sales']}
                          />
                          <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white/70  p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Top Customers</h3>
                    <div className="flex-grow relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TOP_CUSTOMERS_DATA} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} tickFormatter={(value) => `฿${value/1000}k`} />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280', fontWeight: 500}} width={80} />
                          <Tooltip 
                            cursor={{fill: '#F3F4F6'}}
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            itemStyle={{color: '#1F2937', fontSize: '12px', fontWeight: 'bold'}}
                            formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Bar dataKey="value" fill="#403C2A" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {activeTab === 'list' && (
              <div className="px-6 py-4 border-t border-gray-100/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40  shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold font-mono">
                  <span>Show</span>
                  <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-white/80 border border-gray-200/60 rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                    <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500"><ChevronLeft size={14} /></button>
                  <span className="text-xs font-bold text-slate-900 px-2 bg-white/80 border border-gray-200/60 py-2 rounded-lg">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500"><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60  z-50 flex justify-center items-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border-t-[6px] border-[#D4AF37] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                    {modalMode === 'create' ? 'New Sales Order' : (modalMode === 'edit' ? 'Edit Sales Order' : 'Sales Order Detail')}
                  </h3>
                  {selectedOrder ? (
                    <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">SO: {selectedOrder.soNumber}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">{selectedOrder.status}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-mono mt-1">DRAFT MODE</div>
                  )}
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white">
              {/* Sidebar */}
              <div className="w-60 bg-gray-50/80 border-r border-gray-200 p-4 space-y-2 shrink-0 font-sans overflow-y-auto">
                {[
                  { id: 'Order Info', icon: Info },
                  { id: 'Items & Pricing', icon: ShoppingCart },
                  { id: 'Delivery Schedule', icon: Truck },
                  { id: 'Summary & Note', icon: FileText },
                  { id: 'History Log', icon: History }
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveModalTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold rounded-lg transition-all text-left uppercase tracking-wide ${activeModalTab === tab.id ? 'bg-slate-900 text-[#D4AF37] shadow-md' : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'}`}
                  >
                    <tab.icon size={16} /> {tab.id}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 font-sans">
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* Order Info Tab */}
                  {activeModalTab === 'Order Info' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                      <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Order Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Customer Name</label><input value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Select customer..." /></div>
                        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Status</label>
                          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                            {STATUSES.filter(x => x !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Sales Person</label><input value={formData.salesPerson} onChange={e => setFormData({...formData, salesPerson: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Payment Term</label>
                          <select value={formData.paymentTerm} onChange={e => setFormData({...formData, paymentTerm: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                            <option>Cash</option><option>Credit 30 Days</option><option>Credit 60 Days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items & Pricing Tab */}
                  {activeModalTab === 'Items & Pricing' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Order Items</h4>
                        {modalMode !== 'view' && <button onClick={addItem} className="text-[10px] bg-slate-900/10 text-slate-900 px-2 py-1 rounded hover:bg-slate-900 hover:text-white transition flex items-center gap-1 font-bold">+ Add Item</button>}
                      </div>
                      <div className="space-y-3">
                        {formData.items.map((item: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                            <div className="flex gap-4 items-end">
                              <div className="flex-grow"><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Product</label><input value={item.name} onChange={e => {const newItems = [...formData.items]; newItems[idx].name = e.target.value; setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" placeholder="Search SKU..." /></div>
                              <div className="w-24"><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Qty</label><input type="number" value={item.qty} onChange={e => {const newItems = [...formData.items]; newItems[idx].qty = Number(e.target.value); setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-center font-bold text-slate-900 text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                              <div className="w-32"><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Price</label><input type="number" value={item.price} onChange={e => {const newItems = [...formData.items]; newItems[idx].price = Number(e.target.value); setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-right text-xs focus:outline-none focus:border-[#D4AF37]" /></div>
                              <div className="w-24 text-right"><label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Total</label><span className="text-sm font-bold text-slate-900 block py-1">฿{(item.qty * item.price).toLocaleString()}</span></div>
                              {modalMode !== 'view' && <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-2 mb-0.5"><X size={16} /></button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Schedule Tab */}
                  {activeModalTab === 'Delivery Schedule' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                      <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Delivery Schedule & Allocation</h4>
                      <div className="space-y-6">
                        {formData.items.map((item: any, idx: number) => (
                          <div key={idx} className="border-b border-dashed border-gray-200 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-3">
                              <div className="font-bold text-sm text-slate-900">{idx+1}. {item.name || 'Unknown Item'}</div>
                              {modalMode !== 'view' && <button onClick={() => addDelivery(idx)} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 font-bold">+ Split Delivery</button>}
                            </div>
                            <div className="text-[10px] text-gray-500 mb-2 font-mono">
                              Required: <b className="text-slate-900">{item.qty}</b> | Allocated: <b className="text-slate-900">0</b>
                            </div>
                            
                            {(!item.deliveries || item.deliveries.length === 0) ? (
                              <div className="text-xs text-gray-400 italic pl-2">One-time delivery on SO Date. (System will allocate auto)</div>
                            ) : (
                              <div className="space-y-2 pl-2">
                                {item.deliveries.map((del: any, dIdx: number) => (
                                  <div key={dIdx} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-xs text-gray-400 w-4">#{dIdx+1}</span>
                                    <input type="date" value={del.date} onChange={e => {const newItems = [...formData.items]; newItems[idx].deliveries[dIdx].date = e.target.value; setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="w-32 bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" />
                                    <input type="number" value={del.qty} onChange={e => {const newItems = [...formData.items]; newItems[idx].deliveries[dIdx].qty = Number(e.target.value); setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="w-24 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-right font-bold focus:outline-none focus:border-[#D4AF37]" placeholder="Qty" />
                                    <input type="text" value={del.destination} onChange={e => {const newItems = [...formData.items]; newItems[idx].deliveries[dIdx].destination = e.target.value; setFormData({...formData, items: newItems})}} disabled={modalMode === 'view'} className="flex-grow bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" placeholder="Specific Location" />
                                    {modalMode !== 'view' && <button onClick={() => removeDelivery(idx, dIdx)} className="text-red-400 hover:text-red-600 ml-2"><X size={14} /></button>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary & Note Tab */}
                  {activeModalTab === 'Summary & Note' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-4 tracking-widest border-b border-gray-100 pb-3">Summary</h4>
                        <div className="flex justify-end">
                          <div className="w-64 space-y-2">
                            <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>{formatCurrency(calculateTotal())}</span></div>
                            <div className="flex justify-between text-xs text-gray-500"><span>Discount</span><span className="text-[#BE123C]">-0</span></div>
                            <div className="flex justify-between text-lg font-black text-slate-900 border-t border-gray-200 pt-2 mt-2"><span>Grand Total</span><span>{formatCurrency(calculateTotal())}</span></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">Note</h4>
                        <textarea rows={3} placeholder="Additional details..." disabled={modalMode === 'view'} className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] shadow-inner font-sans resize-none"></textarea>
                      </div>
                    </div>
                  )}

                  {/* History Log Tab */}
                  {activeModalTab === 'History Log' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                      <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">History Log</h4>
                      <div className="text-center text-gray-400 text-xs italic py-8">No history available</div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0 z-10 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 text-xs font-bold hover:bg-gray-200 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Close</button>
              
              {(modalMode === 'create' || modalMode === 'edit') && (
                <button onClick={saveOrder} className="px-8 py-3 bg-[#403C2A] hover:bg-[#403C2A]/90 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono">
                  <Save size={14} /> Save Order
                </button>
              )}

              {modalMode === 'view' && (
                <>
                  <button onClick={() => setModalMode('edit')} className="px-6 py-3 bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Settings size={14} /> Edit
                  </button>
                  <button onClick={() => deleteOrder(selectedOrder?.id as number)} className="px-6 py-3 bg-[#BE123C]/10 text-[#BE123C] hover:bg-[#BE123C] hover:text-white border border-[#BE123C]/20 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
