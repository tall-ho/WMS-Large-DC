import { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  FileText, 
  CheckCircle, 
  Clock, 
  X, 
  Printer, 
  Edit, 
  Trash2,
  Kanban,
  List,
  User,
  History,
  FolderCheck,
  Stamp,
  Eye
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';

// --- Types ---
interface PRItem {
  code: string;
  name: string;
  qty: number;
  price: number;
}

interface PRHistory {
  date: string;
  user: string;
  action: string;
  note: string;
}

interface PurchaseRequisition {
  id: string;
  date: string;
  requester: string;
  department: string;
  urgency: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending Verify' | 'Pending Approve' | 'Approved' | 'Revise' | 'Rejected' | 'Cancelled';
  items: PRItem[];
  totalAmount: number;
  history: PRHistory[];
}

// --- Mock Data ---
const MOCK_PRS: PurchaseRequisition[] = [
  { 
    id: 'PR-2601-001', date: '2026-01-15', requester: 'Somchai', department: 'Production', urgency: 'Normal', status: 'Pending Verify', 
    items: [{code: 'RM-MT-001', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', qty: 50, price: 150}], totalAmount: 7500, 
    history: [{date: '2026-01-15 09:00', user: 'Somchai', action: 'Created', note: 'Initial Request for Lot A'}] 
  },
  { 
    id: 'PR-2601-002', date: '2026-01-16', requester: 'Wipa', department: 'Warehouse', urgency: 'Urgent', status: 'Approved', 
    items: [{code: 'PT-WHL-001', name: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', qty: 200, price: 45}], totalAmount: 9000, 
    history: [
      {date: '2026-01-16 10:00', user: 'Wipa', action: 'Created', note: 'Stock critical low'}, 
      {date: '2026-01-16 11:00', user: 'Purchaser', action: 'Verified', note: 'Vendor confirmed stock'}, 
      {date: '2026-01-16 14:00', user: 'Manager', action: 'Approved', note: 'Proceed immediately'}
    ] 
  },
  { 
    id: 'PR-2601-003', date: '2026-01-18', requester: 'Nop', department: 'Maintenance', urgency: 'Normal', status: 'Pending Approve', 
    items: [{code: 'PT-SCR-001', name: 'สกรูเกลียวปล่อย #8', qty: 1000, price: 0.5}], totalAmount: 500, 
    history: [
      {date: '2026-01-18 09:00', user: 'Nop', action: 'Created', note: 'Monthly maintenance'}, 
      {date: '2026-01-18 10:30', user: 'Purchaser', action: 'Verified', note: 'Price matched contract'}
    ] 
  },
];

const MOCK_ITEMS = [
  { code: 'RM-MT-001', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', price: 150 },
  { code: 'RM-MT-002', name: 'ท่อสแตนเลส 304 (0.5 นิ้ว)', price: 80 },
  { code: 'PT-WHL-001', name: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', price: 45 },
  { code: 'PT-SCR-001', name: 'สกรูเกลียวปล่อย #8', price: 0.5 },
  { code: 'RM-WD-005', name: 'ไม้อัดยาง 15mm (เกรด A)', price: 450 }
];

export default function PurchaseRequisitionPage() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'kanban' | 'log'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [prList, setPrList] = useState<PurchaseRequisition[]>(MOCK_PRS);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'verify' | 'approve'>('view');
  const [formData, setFormData] = useState<PurchaseRequisition>({
    id: '', date: '', department: '', requester: '', urgency: 'Normal', status: 'Pending Verify', items: [], totalAmount: 0, history: []
  });
  const [itemInput, setItemInput] = useState({ code: '', qty: 1 });

  // --- Computed ---
  const filteredPRs = useMemo(() => {
    let res = prList;
    if (statusFilter !== 'All') res = res.filter(pr => pr.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(pr => 
        pr.id.toLowerCase().includes(q) || 
        pr.requester.toLowerCase().includes(q) ||
        pr.department.toLowerCase().includes(q)
      );
    }
    return res;
  }, [prList, statusFilter, searchQuery]);

  const paginatedPRs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPRs.slice(start, start + itemsPerPage);
  }, [filteredPRs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPRs.length / itemsPerPage) || 1;

  const stats = useMemo(() => ({
    total: prList.length,
    pendingVerify: prList.filter(p => p.status === 'Pending Verify').length,
    pendingApprove: prList.filter(p => p.status === 'Pending Approve').length,
    approved: prList.filter(p => p.status === 'Approved').length
  }), [prList]);

  // --- Actions ---
  const openModal = (pr: PurchaseRequisition | null = null, mode: 'create' | 'edit' | 'view' | 'verify' | 'approve' = 'create') => {
    setModalMode(mode);
    if (mode === 'create') {
      setFormData({
        id: `PR-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        department: 'Production',
        requester: 'Admin',
        urgency: 'Normal',
        status: 'Pending Verify',
        items: [],
        totalAmount: 0,
        history: []
      });
    } else if (pr) {
      setFormData(JSON.parse(JSON.stringify(pr)));
    }
    setShowModal(true);
  };

  const addItem = () => {
    const item = MOCK_ITEMS.find(i => i.code === itemInput.code);
    if (item) {
      const newItems = [...formData.items, { ...item, qty: itemInput.qty }];
      const total = newItems.reduce((sum, i) => sum + (i.price * i.qty), 0);
      setFormData({ ...formData, items: newItems, totalAmount: total });
      setItemInput({ code: '', qty: 1 });
    }
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const total = newItems.reduce((sum, i) => sum + (i.price * i.qty), 0);
    setFormData({ ...formData, items: newItems, totalAmount: total });
  };

  const savePR = () => {
    const newLog: PRHistory = {
      date: new Date().toLocaleString(),
      user: 'Admin',
      action: modalMode === 'create' ? 'Created' : 'Edited',
      note: modalMode === 'create' ? 'New PR Request' : 'Modified Details'
    };

    if (modalMode === 'edit') {
      setPrList(prev => prev.map(p => p.id === formData.id ? { ...formData, history: [...p.history, newLog] } : p));
    } else {
      setPrList(prev => [{ ...formData, history: [newLog] }, ...prev]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Success', text: 'PR Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const updateStatus = async (status: PurchaseRequisition['status']) => {
    let note = '';
    if (['Revise', 'Cancelled', 'Rejected'].includes(status)) {
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Reason / Note (Required)',
        inputPlaceholder: `Please enter reason for ${status}...`,
        showCancelButton: true,
        confirmButtonColor: '#D94A3D',
        confirmButtonText: 'Submit',
        inputValidator: (value) => {
          if (!value) return 'You need to write something!'
        }
      });
      if (!text) return;
      note = text;
    }

    const userRole = modalMode === 'verify' ? 'Purchaser' : (modalMode === 'approve' ? 'Manager' : 'User');
    const newLog: PRHistory = {
      date: new Date().toLocaleString(),
      user: userRole,
      action: status,
      note: note
    };

    setPrList(prev => prev.map(p => p.id === formData.id ? { ...p, status: status, history: [...p.history, newLog] } : p));
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Updated', text: `Status updated to ${status}`, timer: 1500, showConfirmButton: false });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending Verify': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Pending Approve': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Revise': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cancelled': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'Critical': return 'bg-red-50 text-red-600 border-red-200';
      case 'Urgent': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getBoardItems = (status: string) => {
    if (status === 'Rejected/Cancelled') return prList.filter(p => ['Rejected', 'Cancelled'].includes(p.status));
    return prList.filter(p => p.status === status);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F8F4]">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F8F4]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <ShoppingCart size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">PURCHASE</span> <span className="font-semibold">REQUISITION</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Internal Requests</span>
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('kanban')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'kanban' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Kanban size={14} /> BOARD VIEW
          </button>
          <button onClick={() => setActiveTab('log')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'log' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> PR LIST
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="Total PR" value={stats.total} icon={FileText} iconColor="text-blue-500" subValue="All Records" />
            <KPICard title="Pending Verify" value={stats.pendingVerify} icon={Search} iconColor="text-[#D4AF37]" subValue="Purchaser Review" />
            <KPICard title="Pending Approve" value={stats.pendingApprove} icon={Clock} iconColor="text-purple-600" subValue="Manager Approval" />
            <KPICard title="Approved" value={stats.approved} icon={CheckCircle} iconColor="text-green-600" subValue="Ready for PO" />
          </div>

          {/* Content Area */}
          <div className="bg-white/80 backdrop-blur-xl rounded-none shadow-sm border border-white/60 flex flex-col overflow-hidden min-h-[600px] mx-8 mb-8">
            
            {/* Toolbar (Log Tab Only) */}
            {activeTab === 'log' && (
              <div className="px-6 py-3 border-b border-gray-100/50 flex flex-col xl:flex-row items-center justify-between gap-3 bg-white/40 backdrop-blur-sm">
                <div className="flex flex-1 items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1 p-1 bg-gray-100/60 rounded-lg border border-white/50 backdrop-blur-sm shrink-0">
                    {['All', 'Pending Verify', 'Pending Approve', 'Revise', 'Approved', 'Rejected', 'Cancelled'].map(status => (
                      <button 
                        key={status} 
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap font-mono ${statusFilter === status ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <div className="h-6 w-px bg-gray-200 mx-1 hidden xl:block shrink-0"></div>
                  <div className="relative w-full xl:w-64 shrink-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      placeholder="Search PR..." 
                      className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60 backdrop-blur-sm transition-colors font-mono" 
                    />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 flex-nowrap items-center ml-auto">
                  <button onClick={() => openModal(null, 'create')} className="px-4 py-2 rounded-lg text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={14} /> CREATE PR
                  </button>
                </div>
              </div>
            )}

            {/* Kanban View */}
            {activeTab === 'kanban' && (
              <div className="flex-1 overflow-x-auto custom-scrollbar p-6 bg-gray-50/30">
                <div className="flex gap-6 h-full min-w-max">
                  {/* Column 1: Pending Verify */}
                  <div className="w-80 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div> Pending Verify</h4>
                      <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Pending Verify').length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                      {getBoardItems('Pending Verify').map(pr => (
                        <div key={pr.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group relative" onClick={() => openModal(pr, 'verify')}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">{pr.id}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{pr.date}</span>
                          </div>
                          <div className="mb-3">
                            <div className="text-xs font-bold text-slate-900">{pr.department}</div>
                            <div className="text-[10px] text-slate-500">Req: {pr.requester}</div>
                          </div>
                          <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                            <div className="text-[10px] text-gray-500">{pr.items.length} Items</div>
                            <span className="text-xs font-bold text-slate-900">฿{pr.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="mt-3">
                            <button onClick={(e) => { e.stopPropagation(); openModal(pr, 'verify'); }} className="w-full bg-[#D4AF37] text-white text-[10px] py-1.5 rounded hover:bg-[#D4AF37]/90 transition-colors font-bold">Verify</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Pending Approve */}
                  <div className="w-80 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Pending Approve</h4>
                      <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Pending Approve').length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                      {getBoardItems('Pending Approve').map(pr => (
                        <div key={pr.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group" onClick={() => openModal(pr, 'approve')}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{pr.id}</span>
                            <div className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${pr.urgency === 'Critical' ? 'bg-red-500 animate-pulse' : (pr.urgency === 'Urgent' ? 'bg-orange-400' : 'bg-green-400')}`}></span>
                              <span className="text-[9px] text-gray-400 font-mono">{pr.urgency}</span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="text-xs font-bold text-slate-900">{pr.department}</div>
                            <div className="text-[10px] text-slate-500">Req: {pr.requester}</div>
                          </div>
                          <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                            <span className="text-xs font-bold text-slate-900">฿{pr.totalAmount.toLocaleString()}</span>
                            <button onClick={(e) => { e.stopPropagation(); openModal(pr, 'approve'); }} className="bg-blue-500 text-white text-[10px] px-3 py-1.5 rounded hover:bg-blue-600 transition-colors font-bold flex items-center gap-1">
                              <Stamp size={12} /> Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Approved */}
                  <div className="w-80 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Approved</h4>
                      <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Approved').length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                      {getBoardItems('Approved').map(pr => (
                        <div key={pr.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{pr.id}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{pr.date}</span>
                          </div>
                          <div className="mb-3">
                            <div className="text-xs font-bold text-slate-900">{pr.department}</div>
                            <div className="text-[10px] text-slate-500">Req: {pr.requester}</div>
                          </div>
                          <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                            <span className="text-xs font-bold text-slate-900">฿{pr.totalAmount.toLocaleString()}</span>
                            <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold"><CheckCircle size={12} /> Ready for PO</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List View */}
            {activeTab === 'log' && (
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">PR ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Department</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Items</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Urgency</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedPRs.map(pr => (
                      <tr key={pr.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-[#D4AF37]">{pr.id}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">{pr.date}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-xs">{pr.department}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <User size={10} /> {pr.requester}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-mono">{pr.items.length}</td>
                        <td className="px-6 py-4 text-right font-mono text-xs font-bold text-slate-900">฿{pr.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getUrgencyColor(pr.urgency)}`}>{pr.urgency}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(pr.status)}`}>{pr.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-1">
                            {pr.status === 'Pending Verify' && (
                              <>
                                <button onClick={() => openModal(pr, 'edit')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors" title="Edit"><Edit size={14} /></button>
                                <button onClick={() => openModal(pr, 'verify')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-orange-500 hover:border-orange-500 transition-colors" title="Verify"><FolderCheck size={14} /></button>
                              </>
                            )}
                            {pr.status === 'Pending Approve' && (
                              <button onClick={() => openModal(pr, 'approve')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-blue-500 hover:border-blue-500 transition-colors" title="Approve"><Stamp size={14} /></button>
                            )}
                            {pr.status === 'Approved' && (
                              <button className="p-1.5 rounded bg-white border border-gray-200 hover:text-slate-900 hover:border-slate-900 transition-colors" title="Print"><Printer size={14} /></button>
                            )}
                            {['Revise', 'Cancelled', 'Rejected'].includes(pr.status) && (
                              <button onClick={() => openModal(pr, 'view')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-slate-900 transition-colors" title="View"><Eye size={14} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Draggable Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'create' ? 'Create PR' : 'PR Details'}>
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                {modalMode === 'create' ? 'Create New PR' : (modalMode === 'edit' ? 'Edit PR' : (modalMode === 'verify' ? 'Verify PR' : (modalMode === 'approve' ? 'Approve PR' : 'View PR')))}
              </h3>
              <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">PR ID: {formData.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusColor(formData.status)}`}>{formData.status}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9F8F4] font-sans">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-white relative mb-6">
            <h4 className="text-xs font-bold text-slate-900/70 uppercase mb-4 tracking-widest border-b border-[#D4AF37]/20 pb-2">General Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Date</label><input type="date" value={formData.date} readOnly={!['create', 'edit'].includes(modalMode)} className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Department</label>
                <select value={formData.department} disabled={!['create', 'edit'].includes(modalMode)} className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]">
                  <option>Production</option><option>Warehouse</option><option>Office</option><option>Maintenance</option>
                </select>
              </div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Requester</label><input value={formData.requester} readOnly={!['create', 'edit'].includes(modalMode)} className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Urgency</label>
                <select value={formData.urgency} disabled={!['create', 'edit'].includes(modalMode)} className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]">
                  <option>Normal</option><option>Urgent</option><option>Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-white relative mb-6">
            <h4 className="text-xs font-bold text-slate-900/70 uppercase mb-4 tracking-widest border-b border-[#D4AF37]/20 pb-2">Items</h4>
            {['create', 'edit'].includes(modalMode) && (
              <div className="flex gap-2 mb-4 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Select Item</label>
                  <select className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]" value={itemInput.code} onChange={e => setItemInput({...itemInput, code: e.target.value})}>
                    <option value="">-- Choose RM / Part --</option>
                    {MOCK_ITEMS.map(i => <option key={i.code} value={i.code}>{i.code} - {i.name}</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Qty</label>
                  <input type="number" className="w-full bg-white border-b border-gray-200 px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37] text-center" value={itemInput.qty} onChange={e => setItemInput({...itemInput, qty: parseInt(e.target.value)})} />
                </div>
                <button onClick={addItem} className="bg-slate-900 text-[#D4AF37] p-2.5 rounded-lg font-bold text-xs shadow-md hover:bg-slate-800 uppercase tracking-wide font-mono">Add</button>
              </div>
            )}
            
            <div className="overflow-hidden border border-gray-100 rounded-xl">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-[10px] text-slate-500 uppercase font-bold font-mono">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Est. Price</th>
                    <th className="p-3 text-right">Total</th>
                    {['create', 'edit'].includes(modalMode) && <th className="p-3 text-center"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {formData.items.map((i, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{i.code}</td>
                      <td className="p-3 text-gray-600">{i.name}</td>
                      <td className="p-3 text-right font-mono">{i.qty}</td>
                      <td className="p-3 text-right font-mono text-gray-500">{i.price.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{(i.qty * i.price).toLocaleString()}</td>
                      {['create', 'edit'].includes(modalMode) && (
                        <td className="p-3 text-center">
                          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {formData.items.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No items added.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-white relative">
            <h4 className="text-xs font-bold text-slate-900/70 uppercase mb-4 tracking-widest border-b border-[#D4AF37]/20 pb-2 flex items-center gap-2">
              <History size={14} className="text-[#D4AF37]" /> History Log
            </h4>
            <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
              {formData.history.length > 0 ? (
                formData.history.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-dashed border-gray-100 pb-2 last:border-0">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${log.action.includes('Approved') ? 'bg-green-500' : (log.action.includes('Rejected') || log.action.includes('Cancelled') ? 'bg-red-500' : (log.action.includes('Revise') ? 'bg-orange-500' : 'bg-blue-500'))}`}></span>
                        {log.action}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">by {log.user}</div>
                      {log.note && <div className="text-[10px] text-gray-500 italic mt-1 bg-gray-50 p-1 rounded">"{log.note}"</div>}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono text-right">{log.date}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 italic text-xs py-2">No history available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0 z-10 rounded-b-2xl">
          <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-500 hover:text-slate-900 text-xs font-bold hover:bg-gray-200 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel</button>
          
          {['create', 'edit'].includes(modalMode) && (
            <>
              {modalMode === 'edit' && <button onClick={() => updateStatus('Cancelled')} className="px-6 py-2.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel PR</button>}
              <button onClick={savePR} className="px-8 py-2.5 bg-[#403C2A] hover:bg-[#403C2A]/90 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono">
                <CheckCircle size={14} /> Submit PR
              </button>
            </>
          )}
          
          {modalMode === 'verify' && (
            <>
              <button onClick={() => updateStatus('Revise')} className="px-6 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono">Revise</button>
              <button onClick={() => updateStatus('Cancelled')} className="px-6 py-2.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel</button>
              <button onClick={() => updateStatus('Pending Approve')} className="px-8 py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 uppercase tracking-widest font-mono">
                <FolderCheck size={14} /> Verify
              </button>
            </>
          )}
          
          {modalMode === 'approve' && (
            <>
              <button onClick={() => updateStatus('Revise')} className="px-6 py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono">Revise</button>
              <button onClick={() => updateStatus('Rejected')} className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono">Reject</button>
              <button onClick={() => updateStatus('Approved')} className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 uppercase tracking-widest font-mono">
                <Stamp size={14} /> Approve
              </button>
            </>
          )}
        </div>
      </DraggableModal>
    </div>
  );
}
