import { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  FileText, 
  CheckCircle, 
  Clock, 
  Truck, 
  X, 
  Printer, 
  Send, 
  Eye, 
  Stamp,
  Kanban,
  List
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';

// --- Types ---
interface PurchaseOrder {
  id: number;
  poNumber: string;
  date: string;
  vendor: string;
  vendorAddress: string;
  prRef: string;
  grandTotal: number;
  subTotal: number;
  vat: number;
  status: 'Pending Approve' | 'Approved' | 'Sent' | 'Partial' | 'Completed' | 'Cancelled';
  paymentTerm: string;
  deliveryDate: string;
  remarks: string;
  items: POItem[];
}

interface POItem {
  code: string;
  name: string;
  qty: number;
  price: number;
}

interface PR {
  id: string;
  date: string;
  requester: string;
  department: string;
  totalAmount: number;
  items: POItem[];
}

// --- Mock Data ---
const MOCK_POS: PurchaseOrder[] = [
  { id: 1, poNumber: 'PO-2026-001', date: '2026-01-18', vendor: 'Thai Steel Co.', vendorAddress: '123 Steel Rd.', prRef: 'PR-2601-001', grandTotal: 8025, subTotal: 7500, vat: 525, status: 'Sent', items: [{code: 'RM-MT-001', name: 'ท่อสแตนเลส', qty: 50, price: 150}], paymentTerm: 'Credit 30 Days', deliveryDate: '2026-01-25', remarks: 'Urgent delivery required' },
  { id: 2, poNumber: 'PO-2026-002', date: '2026-01-19', vendor: 'Nut & Bolt Shop', vendorAddress: '456 Tool St.', prRef: 'PR-2601-003', grandTotal: 535, subTotal: 500, vat: 35, status: 'Completed', items: [{code: 'PT-SCR-001', name: 'สกรู', qty: 1000, price: 0.5}], paymentTerm: 'Cash', deliveryDate: '2026-01-20', remarks: '-' },
  { id: 3, poNumber: 'PO-2026-003', date: '2026-01-22', vendor: 'Office Supply Co.', vendorAddress: '789 Office Park', prRef: 'PR-2601-004', grandTotal: 5000, subTotal: 4672.90, vat: 327.10, status: 'Pending Approve', items: [{code: 'OF-001', name: 'เก้าอี้', qty: 10, price: 450}], paymentTerm: 'Credit 30 Days', deliveryDate: '2026-01-30', remarks: '-' },
  { id: 4, poNumber: 'PO-2026-004', date: '2026-01-23', vendor: 'Thai Steel Co.', vendorAddress: '123 Steel Rd.', prRef: 'PR-2601-006', grandTotal: 12000, subTotal: 11214.95, vat: 785.05, status: 'Approved', items: [{code: 'RM-MT-002', name: 'ท่อสแตนเลส 0.5', qty: 150, price: 80}], paymentTerm: 'Credit 60 Days', deliveryDate: '2026-02-05', remarks: 'Deliver to warehouse 2' },
];

const MOCK_PENDING_PRS: PR[] = [
  { id: 'PR-2601-002', date: '2026-01-16', requester: 'Wipa', department: 'Warehouse', totalAmount: 9000, items: [{code: 'PT-WHL-001', name: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', qty: 200, price: 45}] },
  { id: 'PR-2601-005', date: '2026-01-20', requester: 'Chai', department: 'Production', totalAmount: 40000, items: [{code: 'RM-MT-002', name: 'ท่อสแตนเลส 304 (0.5 นิ้ว)', qty: 500, price: 80}] }
];

export default function PurchaseOrderPage() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'kanban' | 'pending' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [poList, setPoList] = useState<PurchaseOrder[]>(MOCK_POS);
  const [pendingPRs, setPendingPRs] = useState<PR[]>(MOCK_PENDING_PRS);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PR | null>(null);
  const [poForm, setPoForm] = useState({
    vendor: '',
    vendorAddress: '',
    paymentTerm: 'Credit 30 Days',
    deliveryDate: '',
    remarks: '',
    items: [] as POItem[]
  });

  // --- Computed ---
  const filteredPOList = useMemo(() => {
    if (!searchQuery) return poList;
    const q = searchQuery.toLowerCase();
    return poList.filter(p => p.poNumber.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q));
  }, [poList, searchQuery]);

  const stats = useMemo(() => ({
    pendingPR: pendingPRs.length,
    openPO: poList.filter(p => ['Pending Approve', 'Approved', 'Sent'].includes(p.status)).length,
    completed: poList.filter(p => p.status === 'Completed').length,
    totalSpend: poList.reduce((acc, p) => acc + p.grandTotal, 0)
  }), [poList, pendingPRs]);

  // --- Actions ---
  const openGenerateModal = (pr: PR) => {
    setSelectedPR(pr);
    setPoForm({
      vendor: '',
      vendorAddress: '',
      paymentTerm: 'Credit 30 Days',
      deliveryDate: '',
      remarks: '',
      items: JSON.parse(JSON.stringify(pr.items))
    });
    setShowModal(true);
  };

  const calculateSubtotal = () => poForm.items.reduce((sum, i) => sum + (i.qty * i.price), 0);

  const confirmGeneratePO = () => {
    if (!poForm.vendor) return Swal.fire('Error', 'Please enter Vendor Name', 'error');
    
    const subTotal = calculateSubtotal();
    const newPO: PurchaseOrder = {
      id: Date.now(),
      poNumber: `PO-${new Date().getFullYear()}-${String(poList.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      vendor: poForm.vendor,
      vendorAddress: poForm.vendorAddress,
      prRef: selectedPR?.id || '',
      paymentTerm: poForm.paymentTerm,
      deliveryDate: poForm.deliveryDate || '-',
      remarks: poForm.remarks || '-',
      items: poForm.items,
      grandTotal: subTotal * 1.07,
      subTotal: subTotal,
      vat: subTotal * 0.07,
      status: 'Pending Approve' 
    };
    
    setPoList(prev => [newPO, ...prev]);
    setPendingPRs(prev => prev.filter(p => p.id !== selectedPR?.id));
    
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'PO Generated', text: `PO Number: ${newPO.poNumber}`, confirmButtonColor: '#0F172A' });
  };

  const updateStatus = (newStatus: PurchaseOrder['status'], id: number) => {
    setPoList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    Swal.fire('Updated', `Status changed to ${newStatus}`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending Approve': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Approved': return 'bg-green-50 text-green-600 border-green-200';
      case 'Partial': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getBoardItems = (status: string) => poList.filter(p => p.status === status);

  return (
    <div className="flex flex-col h-full bg-[#F9F8F4]">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F8F4]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1F1E1B] text-white shadow-lg flex-shrink-0 border border-white/20">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">PURCHASE</span> <span className="font-semibold">ORDER</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Procurement Management</span>
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('kanban')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'kanban' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Kanban size={14} /> BOARD
          </button>
          <button onClick={() => setActiveTab('pending')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'pending' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Clock size={14} /> PENDING PR
          </button>
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> PO LIST
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="PR to Process" value={stats.pendingPR} icon={FileText} iconColor="text-[#D4AF37]" subValue="Wait for PO" />
            <KPICard title="Open POs" value={stats.openPO} icon={Truck} iconColor="text-blue-500" subValue="In Process" />
            <KPICard title="Completed" value={stats.completed} icon={CheckCircle} iconColor="text-green-600" subValue="Received All" />
            <KPICard title="Total Spend" value={`฿${stats.totalSpend.toLocaleString()}`} icon={ShoppingBag} iconColor="text-purple-600" subValue="Current Month" />
          </div>

          {/* Kanban View */}
          {activeTab === 'kanban' && (
            <div className="flex-1 overflow-x-auto custom-scrollbar pb-4 h-[650px] px-8">
              <div className="flex gap-6 h-full min-w-max">
                {/* Column 1: Ready to PO */}
                <div className="w-72 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div> PR Approved</h4>
                    <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{pendingPRs.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {pendingPRs.map(pr => (
                      <div key={pr.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group relative" onClick={() => openGenerateModal(pr)}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-[#9F9679] bg-[#9F9679]/10 px-1.5 py-0.5 rounded">{pr.id}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{pr.date}</span>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs font-bold text-slate-900">{pr.department}</div>
                          <div className="text-[10px] text-slate-500">Req: {pr.requester}</div>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex justify-between items-center">
                          <div className="text-[10px] text-gray-500">{pr.items.length} Items</div>
                          <span className="text-xs font-bold text-[#D4AF37]">฿{pr.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <button onClick={(e) => { e.stopPropagation(); openGenerateModal(pr); }} className="w-full bg-[#7A816C] text-white text-[10px] py-1.5 rounded hover:bg-[#7A816C]/90 transition-colors font-bold">Generate PO</button>
                        </div>
                      </div>
                    ))}
                    {pendingPRs.length === 0 && <div className="text-center text-gray-400 text-xs py-8 italic">No pending PRs</div>}
                  </div>
                </div>

                {/* Column 2: Pending Approval */}
                <div className="w-72 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Pending Approval</h4>
                    <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Pending Approve').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {getBoardItems('Pending Approve').map(po => (
                      <div key={po.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-gray-100 px-1.5 py-0.5 rounded">{po.poNumber}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{po.date}</span>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs font-bold text-slate-900 truncate">{po.vendor}</div>
                          <div className="text-[10px] text-slate-500">Ref: {po.prRef}</div>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-slate-900">฿{po.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <button onClick={() => updateStatus('Approved', po.id)} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                            <Stamp size={12} /> Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Approved */}
                <div className="w-72 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Approved</h4>
                    <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Approved').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {getBoardItems('Approved').map(po => (
                      <div key={po.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-gray-100 px-1.5 py-0.5 rounded">{po.poNumber}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{po.date}</span>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs font-bold text-slate-900 truncate">{po.vendor}</div>
                          <div className="text-[10px] text-slate-500">{po.items.length} Items</div>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-slate-900">฿{po.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 bg-[#D1A9A5] hover:bg-[#D1A9A5]/90 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                            <Printer size={12} /> Print
                          </button>
                          <button onClick={() => updateStatus('Sent', po.id)} className="flex-1 bg-[#d8c8b7] hover:bg-[#d8c8b7]/90 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                            <Send size={12} /> Send
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Waiting Delivery */}
                <div className="w-72 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400"></div> Waiting Delivery</h4>
                    <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Sent').length + getBoardItems('Partial').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {[...getBoardItems('Sent'), ...getBoardItems('Partial')].map(po => (
                      <div key={po.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-gray-100 px-1.5 py-0.5 rounded">{po.poNumber}</span>
                          {po.status === 'Partial' ? (
                            <span className="text-[9px] font-bold text-white bg-purple-400 px-1.5 py-0.5 rounded">Partial</span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-mono">{po.date}</span>
                          )}
                        </div>
                        <div className="mb-2">
                          <div className="text-xs font-bold text-slate-900 truncate">{po.vendor}</div>
                          <div className="text-[10px] text-slate-500">Waiting Delivery</div>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-slate-900">฿{po.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <button className="w-full bg-purple-400 hover:bg-purple-500 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                            <Truck size={12} /> Track
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 5: Completed */}
                <div className="w-72 flex-shrink-0 flex flex-col h-full bg-gray-100/50 rounded-xl p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Completed</h4>
                    <span className="bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-gray-200">{getBoardItems('Completed').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {getBoardItems('Completed').map(po => (
                      <div key={po.id} className="bg-white p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group opacity-75 hover:opacity-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{po.poNumber}</span>
                          <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Completed</span>
                        </div>
                        <div className="mb-2">
                          <div className="text-xs font-bold text-gray-600 truncate">{po.vendor}</div>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-gray-500">฿{po.grandTotal.toLocaleString()}</span>
                          <CheckCircle size={14} className="text-green-500" />
                        </div>
                        <div className="mt-3">
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-[10px] py-1.5 rounded transition-colors font-bold flex items-center justify-center gap-1">
                            <Eye size={12} /> View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending PR Table View */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-[500px] mx-8 mb-8">
              <div className="overflow-auto h-full custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PR No.</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Items</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Est. Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingPRs.map(pr => (
                      <tr key={pr.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-slate-900 text-xs font-mono">{pr.id}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">{pr.date}</td>
                        <td className="px-6 py-4 text-xs">{pr.department}</td>
                        <td className="px-6 py-4 text-xs">{pr.requester}</td>
                        <td className="px-6 py-4 text-center text-xs">{pr.items.length}</td>
                        <td className="px-6 py-4 text-right font-bold text-[#B43B42] text-xs font-mono">฿{pr.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => openGenerateModal(pr)} className="text-slate-900 hover:text-[#D4AF37] font-bold text-[10px] border border-slate-900 hover:border-[#D4AF37] px-2 py-1 rounded transition-colors">Create PO</button>
                        </td>
                      </tr>
                    ))}
                    {pendingPRs.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400 italic text-xs">No pending PRs available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PO List View */}
          {activeTab === 'list' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-none shadow-soft border border-white/60 flex flex-col overflow-hidden min-h-[600px] mx-8 mb-8">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/40">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search PO Number..." className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:outline-none bg-white" />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 shadow-sm bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PO Number</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ref PR</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {filteredPOList.map(po => (
                      <tr key={po.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900">{po.poNumber}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-mono">{po.date}</td>
                        <td className="px-6 py-4 text-xs font-bold">{po.vendor}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">{po.prRef}</td>
                        <td className="px-6 py-4 text-right font-mono text-xs font-bold text-slate-900">฿{po.grandTotal.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(po.status)}`}>{po.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-white rounded transition-colors border border-transparent hover:border-gray-200" title="Print PDF">
                            <Printer size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPOList.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-xs italic">No Purchase Orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Generate PO Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate Purchase Order">
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl text-[#D4AF37]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Generate Purchase Order</h3>
              <p className="text-xs text-gray-500">From PR: {selectedPR?.id}</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400 hover:text-slate-900" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9F8F4] font-sans">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-4 border-b pb-2">Vendor Information</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vendor Name</label>
                <input value={poForm.vendor} onChange={e => setPoForm({...poForm, vendor: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Enter Vendor Name" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payment Term</label>
                <select value={poForm.paymentTerm} onChange={e => setPoForm({...poForm, paymentTerm: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                  <option>Credit 30 Days</option><option>Credit 60 Days</option><option>Cash</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address</label>
                <input value={poForm.vendorAddress} onChange={e => setPoForm({...poForm, vendorAddress: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Vendor Address" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Delivery Date</label>
                <input type="date" value={poForm.deliveryDate} onChange={e => setPoForm({...poForm, deliveryDate: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Remarks</label>
                <input value={poForm.remarks} onChange={e => setPoForm({...poForm, remarks: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Optional notes..." />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase mb-4 border-b pb-2">Order Items</h4>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-slate-500 uppercase font-bold">
                <tr><th className="p-2">Code</th><th className="p-2">Name</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Price</th><th className="p-2 text-right">Total</th></tr>
              </thead>
              <tbody>
                {poForm.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="p-2 font-mono">{item.code}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right font-mono">{item.qty}</td>
                    <td className="p-2 text-right">
                      <input 
                        type="number" 
                        value={item.price} 
                        onChange={e => {
                          const newItems = [...poForm.items];
                          newItems[idx].price = parseFloat(e.target.value);
                          setPoForm({...poForm, items: newItems});
                        }} 
                        className="border rounded p-1 w-20 text-right text-xs" 
                      />
                    </td>
                    <td className="p-2 text-right font-bold">{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <div className="text-xs text-gray-500">Subtotal: ฿{calculateSubtotal().toLocaleString()}</div>
              <div className="text-xs text-gray-500">VAT (7%): ฿{(calculateSubtotal() * 0.07).toLocaleString()}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">Total: ฿{(calculateSubtotal() * 1.07).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white flex justify-end gap-3 shrink-0">
          <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-500 font-bold text-xs hover:bg-gray-100 rounded-xl transition">Cancel</button>
          <button onClick={confirmGeneratePO} className="px-8 py-2.5 bg-[#7A816C] text-white font-bold text-xs rounded-xl hover:bg-[#7A816C]/90 shadow-lg transition flex items-center gap-2">
            <CheckCircle size={16} /> Generate PO
          </button>
        </div>
      </DraggableModal>
    </div>
  );
}
