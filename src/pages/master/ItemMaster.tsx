import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  UploadCloud, 
  Settings, 
  List, 
  BarChart2, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  Tag, 
  Box, 
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Types ---
interface ItemMaster {
  rowId: number;
  itemCode: string;
  itemName: string;
  itemType: string;
  category: string;
  subCategory: string;
  baseUnit: string;
  stdCost: number;
  stdPrice: number;
  leadTime: string;
  moq: string;
  status: 'Active' | 'Inactive';
  updatedAt: string;
}

// --- Mock Data ---
const MOCK_ITEMS: ItemMaster[] = [
  { rowId: 1, itemCode: 'FG-LD-001', itemName: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', itemType: 'FG', category: 'Laundry', subCategory: 'Steel', baseUnit: 'Set', stdCost: 580, stdPrice: 1200, leadTime: '7 Days', moq: '10', status: 'Active', updatedAt: '2026-01-10' },
  { rowId: 2, itemCode: 'FG-LD-002', itemName: 'ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)', itemType: 'FG', category: 'Laundry', subCategory: 'Steel', baseUnit: 'Set', stdCost: 420, stdPrice: 890, leadTime: '7 Days', moq: '10', status: 'Active', updatedAt: '2026-01-10' },
  { rowId: 3, itemCode: 'RM-MT-001', itemName: 'ท่อสแตนเลส 304 (1 นิ้ว)', itemType: 'RM', category: 'Material', subCategory: 'Steel Pipe', baseUnit: 'M', stdCost: 150, stdPrice: 0, leadTime: '3 Days', moq: '50', status: 'Active', updatedAt: '2026-01-12' },
  { rowId: 4, itemCode: 'RM-WD-005', itemName: 'ไม้อัดยาง 15mm (เกรด A)', itemType: 'RM', category: 'Material', subCategory: 'Wood', baseUnit: 'Sheet', stdCost: 450, stdPrice: 0, leadTime: '5 Days', moq: '20', status: 'Active', updatedAt: '2026-01-12' },
  { rowId: 5, itemCode: 'PM-BX-001', itemName: 'กล่องกระดาษลูกฟูก (ราวตากผ้า)', itemType: 'PM', category: 'Packaging', subCategory: 'Box', baseUnit: 'Pcs', stdCost: 25, stdPrice: 0, leadTime: '14 Days', moq: '500', status: 'Active', updatedAt: '2026-01-15' },
  { rowId: 6, itemCode: 'SP-WH-002', itemName: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', itemType: 'SP', category: 'Parts', subCategory: 'Wheel', baseUnit: 'Pcs', stdCost: 45, stdPrice: 0, leadTime: '30 Days', moq: '100', status: 'Active', updatedAt: '2026-01-15' },
];

export default function ItemMasterPage() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [items, setItems] = useState<ItemMaster[]>(MOCK_ITEMS);
  const [groups, setGroups] = useState(['All', 'FG', 'RM', 'WIP', 'PM', 'SP']);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof ItemMaster | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showNameRuleModal, setShowNameRuleModal] = useState(false);
  const [form, setForm] = useState<any>({
    rowId: null, itemCode: '', itemName: '', itemType: '', category: '', subCategory: '',
    baseUnit: '', stdCost: '', stdPrice: '', leadTime: '', moq: '', status: 'Active'
  });

  // Name Rules State
  const [selectedRuleType, setSelectedRuleType] = useState('FG');
  const [nameRules, setNameRules] = useState<any>({
    'FG': '{Category} {SubCategory} {Code}',
    'RM': 'MAT {Category} {SubCategory}',
    'WIP': 'WIP {Category} {SubCategory}',
    'PK': 'PACK {Category} {Code}',
    'SP': 'PART {Category} {Code}',
    'PM': 'PACK {Category} {SubCategory}'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Computed ---
  const filteredItems = useMemo(() => {
    let res = items;
    if (activeGroup !== 'All') {
      res = res.filter(i => i.itemType === activeGroup);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(i => 
        i.itemCode.toLowerCase().includes(q) || 
        i.itemName.toLowerCase().includes(q) || 
        i.category.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      res = [...res].sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (typeof valA === 'string' && typeof valB === 'string') { 
          valA = valA.toLowerCase(); 
          valB = valB.toLowerCase(); 
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return res;
  }, [items, activeGroup, searchQuery, sortKey, sortOrder]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const stats = useMemo(() => ({
    total: items.length,
    fg: items.filter(i => i.itemType === 'FG').length,
    rm: items.filter(i => i.itemType === 'RM').length,
    new: items.filter(i => new Date(i.updatedAt).getMonth() === new Date().getMonth()).length
  }), [items]);

  const previewNameRule = useMemo(() => {
    const rule = nameRules[selectedRuleType] || '';
    const dummy: any = {
      Category: 'Laundry',
      SubCategory: 'Steel',
      Code: '001',
      Group: selectedRuleType,
      Type: selectedRuleType
    };
    let preview = rule;
    Object.keys(dummy).forEach(key => {
      preview = preview.replace(new RegExp(`{${key}}`, 'g'), dummy[key]);
    });
    return preview;
  }, [selectedRuleType, nameRules]);

  // --- Actions ---
  const handleSort = (key: keyof ItemMaster) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getTypeClass = (type: string) => {
    switch(type) {
      case 'FG': return 'bg-blue-100 text-blue-700 border-blue-200'; 
      case 'RM': return 'bg-green-100 text-green-700 border-green-200'; 
      case 'WIP': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; 
      case 'PM': return 'bg-gray-100 text-gray-600 border-gray-200'; 
      case 'SP': return 'bg-red-100 text-red-700 border-red-200'; 
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const openModal = (item: ItemMaster | null = null) => {
    if (item) {
      setForm({ ...item });
    } else {
      setForm({ rowId: null, itemCode: '', itemName: '', itemType: '', category: '', subCategory: '', baseUnit: '', stdCost: '', stdPrice: '', leadTime: '', moq: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const saveItem = () => {
    if (!form.itemName || !form.itemType) return;
    
    const now = new Date().toISOString().split('T')[0];
    
    if (form.rowId) {
      setItems(prev => prev.map(i => i.rowId === form.rowId ? { ...form, updatedAt: now } : i));
    } else {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.rowId)) + 1 : 1;
      if(!form.itemCode) form.itemCode = `${form.itemType}-${String(newId).padStart(4,'0')}`;
      
      setItems(prev => [{ ...form, rowId: newId, updatedAt: now }, ...prev]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const deleteItem = (id: number) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#BE123C', confirmButtonText: 'Yes, delete it!' }).then((result) => {
      if (result.isConfirmed) {
        setItems(prev => prev.filter(i => i.rowId !== id));
        Swal.fire({ title: 'Deleted!', text: 'Item has been deleted.', icon: 'success', confirmButtonColor: '#0F172A' });
      }
    });
  };

  const saveNameRules = () => {
    Swal.fire({ icon: 'success', title: 'Rules Saved', text: `Pattern for ${selectedRuleType} updated.`, timer: 1500, showConfirmButton: false });
  };
  
  const refreshItemNames = () => {
    Swal.fire({
      title: `Refresh ${selectedRuleType} Names?`,
      text: `This will regenerate names for all ${selectedRuleType} items based on the pattern.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Refresh',
      confirmButtonColor: '#D4AF37'
    }).then((res) => {
      if(res.isConfirmed) {
        Swal.fire({ icon: 'success', title: 'Updated', text: `${selectedRuleType} item names refreshed.`, timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const processExcelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    Swal.fire({ icon: 'success', title: 'Load Successful', text: `Loaded data.`, confirmButtonColor: '#0F172A', timer: 1500 });
    if (event.target) event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-transparent">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">ITEM</span> <span className="font-semibold">MASTER</span>
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs mt-1 font-sans">
                <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Product & Material Database</span>
              </p>
              <button onClick={() => setShowNameRuleModal(true)} className="text-[10px] bg-white border border-gray-200 text-slate-500 px-2 py-0.5 rounded hover:bg-slate-900 hover:text-white transition flex items-center gap-1 mt-1 shadow-sm font-mono">
                <Settings size={12} /> Name Rules
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> ITEM LIST
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'analytics' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <BarChart2 size={14} /> ANALYTICS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="Total Items" value={stats.total} icon={Package} iconColor="text-blue-500" subValue="All Records" />
            <KPICard title="Finished Goods" value={stats.fg} icon={Box} iconColor="text-[#D4AF37]" subValue="Ready to Sell" />
            <KPICard title="Raw Materials" value={stats.rm} icon={Tag} iconColor="text-green-600" subValue="Components" />
            <KPICard title="New Items" value={stats.new} icon={Plus} iconColor="text-purple-600" subValue="This Month" />
          </div>

          {/* Content Area */}
          <div className="bg-white/80  rounded-none shadow-sm border border-white/60 flex flex-col overflow-hidden min-h-[600px] mx-8 mb-8">
            
            {/* Toolbar */}
            {activeTab === 'list' && (
              <div className="px-6 py-3 border-b border-gray-100/50 flex flex-col lg:flex-row items-center justify-between gap-3 bg-white/40 ">
                <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1 p-1 bg-gray-100/60 rounded-lg border border-white/50  shrink-0">
                    {groups.map(g => (
                      <button key={g} onClick={() => { setActiveGroup(g); setCurrentPage(1); }} 
                        className={`flex items-center gap-1.5 capitalize font-mono px-2.5 py-1.5 text-xs rounded-md transition-all ${activeGroup === g ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
                        <span>{g}</span>
                        <span className={`text-[9px] h-4 min-w-[16px] flex items-center justify-center rounded-full ${activeGroup === g ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {g === 'All' ? items.length : items.filter(i => i.itemType === g).length}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block shrink-0"></div>

                  <div className="relative w-full lg:w-64 shrink-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Code / Name..." className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60  transition-colors font-mono" />
                  </div>
                </div>
                <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                  <button onClick={handleExcelImport} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F1E1B]/10 text-[#1F1E1B] hover:bg-[#1F1E1B]/20 shadow-sm transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <UploadCloud size={16} /> Upload
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={processExcelFile} />
                  </button>
                  <button onClick={() => openModal()} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={16} /> NEW ITEM
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('itemCode')}>Item Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('itemName')}>Item Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('subCategory')}>Sub Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Unit</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-right cursor-pointer" onClick={() => handleSort('stdCost')}>Std. Cost</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedItems.map(item => (
                      <tr key={item.rowId} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-[#D4AF37]">{item.itemCode}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeClass(item.itemType)}`}>{item.itemType}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-xs font-sans">{item.itemName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{item.category}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{item.subCategory}</td>
                        <td className="px-6 py-4 text-center text-xs font-mono font-bold text-slate-500 bg-white/50 rounded">{item.baseUnit}</td>
                        <td className="px-6 py-4 text-right text-xs font-mono font-bold text-slate-900">฿{item.stdCost.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${item.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors hover:text-slate-900 hover:bg-gray-100" title="View"><Eye size={14} /></button>
                            <button onClick={() => openModal(item)} className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-gray-50" title="Edit"><Edit size={14} /></button>
                            <button onClick={() => deleteItem(item.rowId)} className="w-7 h-7 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors hover:text-white hover:bg-red-500 hover:border-red-500" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedItems.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-xs italic">No items found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analytics View */}
            {activeTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <div className="bg-white/70  p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Item Distribution by Type</h3>
                    <div className="flex-grow relative flex items-center justify-center">
                      <Doughnut 
                        data={{
                          labels: ['FG', 'RM', 'WIP', 'PM', 'SP'],
                          datasets: [{
                            data: [stats.fg, stats.rm, 2, 1, 1], // Mock data
                            backgroundColor: ['#3A3659', '#555934', '#D4AF37', '#64748B', '#B43B42'],
                            borderWidth: 0
                          }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/70  p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Top 10 High Value Materials</h3>
                    <div className="flex-grow relative flex items-center justify-center">
                      <Bar 
                        data={{
                          labels: items.slice(0, 5).map(i => i.itemCode),
                          datasets: [{
                            label: 'Std. Cost',
                            data: items.slice(0, 5).map(i => i.stdCost),
                            backgroundColor: '#0F172A',
                            borderRadius: 4
                          }]
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } } } }}
                      />
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
                  <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white/80 border border-gray-200/60 rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                    <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500"><ChevronLeft size={14} /></button>
                  <span className="text-xs font-bold text-slate-900 px-2 bg-white/80 border border-gray-200/60 py-2 rounded-lg">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500"><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title={form.rowId ? 'Edit Item' : 'New Item'}>
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                {form.rowId ? 'Edit Item' : 'New Item'}
              </h3>
              <p className="text-slate-500 text-[10px] font-medium tracking-wide uppercase font-mono">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">Code: { form.itemCode || 'AUTO' }</span>
              </p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-transparent font-sans space-y-6">
          {/* Group Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 font-mono">Group Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {groups.filter(x => x !== 'All').map(g => (
                <button key={g} onClick={() => setForm({...form, itemType: g})}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border font-mono ${form.itemType === g ? 'bg-slate-900 text-[#D4AF37] border-slate-900 shadow-md' : 'bg-white text-slate-500 border-gray-200 hover:border-[#D4AF37]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#D4AF37]/20 w-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Item Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Stainless Steel Rack" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Laundry" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Sub Category</label>
                  <input type="text" value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Steel" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Base Unit</label>
                  <input type="text" value={form.baseUnit} onChange={e => setForm({...form, baseUnit: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] text-center" placeholder="e.g. Pcs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Std. Cost</label>
                  <input type="number" value={form.stdCost} onChange={e => setForm({...form, stdCost: parseFloat(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] text-right" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Std. Price</label>
                  <input type="number" value={form.stdPrice} onChange={e => setForm({...form, stdPrice: parseFloat(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] text-right" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#D4AF37]/10 bg-white flex justify-end gap-3 shrink-0 z-10 rounded-b-2xl">
          <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 text-xs font-bold hover:bg-gray-100 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel</button>
          <button onClick={saveItem} className={`px-8 py-3 bg-[#403C2A] text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono ${(!form.itemName || !form.itemType) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#403C2A]/90'}`} disabled={!form.itemName || !form.itemType}>
            <CheckCircle size={16} /> Save Item
          </button>
        </div>
      </DraggableModal>

      {/* Name Rule Modal */}
      <DraggableModal isOpen={showNameRuleModal} onClose={() => setShowNameRuleModal(false)} title="Auto-Name Rules" width="max-w-lg">
        <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Auto-Name Rules</h3>
          <button onClick={() => setShowNameRuleModal(false)}><X size={18} /></button>
        </div>
        <div className="p-6 bg-transparent space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Select Group</label>
            <select value={selectedRuleType} onChange={e => setSelectedRuleType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer">
              {groups.filter(x => x !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Naming Pattern</label>
            <input type="text" value={nameRules[selectedRuleType]} onChange={e => setNameRules({...nameRules, [selectedRuleType]: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] font-mono text-xs" />
            <p className="text-[9px] text-gray-400 mt-1">Available tags: {`{Category}, {SubCategory}, {Code}, {Group}`}</p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Preview</p>
            <p className="text-sm font-mono text-slate-900 font-bold">{previewNameRule}</p>
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={refreshItemNames} className="px-4 py-2 bg-gray-200 text-gray-600 text-xs font-bold rounded hover:bg-gray-300">Refresh Items</button>
          <button onClick={saveNameRules} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800">Save Rules</button>
        </div>
      </DraggableModal>
    </div>
  );
}
