import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  Plus, 
  UploadCloud, 
  Settings2, 
  List, 
  BarChart2, 
  Eye, 
  Edit, 
  Trash2, 
  Layers, 
  X, 
  CheckCircle, 
  RotateCcw, 
  AlertOctagon, 
  Tag, 
  Check, 
  Circle,
  Package 
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- Types ---
interface MasterCode {
  rowId: number;
  mastCode: string;
  groups: string[];
  category: string;
  catCode: string;
  subCategory: string;
  subCatCode: string;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

// --- Mock Data ---
const MOCK_ITEMS: MasterCode[] = [
  { rowId: 1, mastCode: 'LDST', groups: ['FG'], category: 'Laundry', catCode: 'LD', subCategory: 'Steel', subCatCode: 'ST', note: 'ราวตากผ้าเหล็ก', updatedAt: '2025-10-25', updatedBy: 'admin@thaimung.com' },
  { rowId: 2, mastCode: 'LDTB', groups: ['FG'], category: 'Laundry', catCode: 'LD', subCategory: 'Table', subCatCode: 'TB', note: 'โต๊ะรีดผ้า', updatedAt: '2025-10-26', updatedBy: 'admin@thaimung.com' },
  { rowId: 3, mastCode: 'MTWD', groups: ['RM'], category: 'Material', catCode: 'MT', subCategory: 'Wood', subCatCode: 'WD', note: 'ไม้ยางพารา', updatedAt: '2025-10-27', updatedBy: 'pur@thaimung.com' },
  { rowId: 4, mastCode: 'MTPP', groups: ['RM'], category: 'Material', catCode: 'MT', subCategory: 'Pipe', subCatCode: 'PP', note: 'ท่อเหล็ก', updatedAt: '2025-10-27', updatedBy: 'pur@thaimung.com' },
  { rowId: 5, mastCode: 'PTWH', groups: ['SP'], category: 'Parts', catCode: 'PT', subCategory: 'Wheel', subCatCode: 'WH', note: 'ล้อเลื่อน', updatedAt: '2025-10-28', updatedBy: 'store@thaimung.com' },
  { rowId: 6, mastCode: 'PKBX', groups: ['PK'], category: 'Packaging', catCode: 'PK', subCategory: 'Box', subCatCode: 'BX', note: 'กล่องกระดาษลูกฟูก', updatedAt: '2025-11-01', updatedBy: 'admin@thaimung.com' },
];

export default function MasterCodePage() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [items, setItems] = useState<MasterCode[]>(MOCK_ITEMS);
  const [groups, setGroups] = useState(['All', 'FG', 'RM', 'WIP', 'PK', 'SP', 'SC']);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof MasterCode | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [form, setForm] = useState<any>({
    rowId: null, groups: [], category: '', catCode: '', subCategory: '', subCatCode: '', note: ''
  });
  
  // Group Edit State
  const [newGroup, setNewGroup] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupText, setEditGroupText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Computed ---
  const filteredItems = useMemo(() => {
    let res = items;
    if (activeGroup !== 'All') {
      res = res.filter(i => i.groups.includes(activeGroup));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(i => 
        i.mastCode.toLowerCase().includes(q) || 
        i.category.toLowerCase().includes(q) || 
        i.subCategory.toLowerCase().includes(q)
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
    fg: items.filter(i => i.groups.includes('FG')).length,
    rm: items.filter(i => i.groups.includes('RM')).length,
    new: items.filter(i => new Date(i.updatedAt).getMonth() === new Date().getMonth()).length
  }), [items]);

  const generatedMastCode = ((form.catCode || '') + (form.subCatCode || '')).toUpperCase();
  const isDuplicate = useMemo(() => {
    if (!form.catCode || !form.subCatCode) return false;
    return items.some(i => i.mastCode === generatedMastCode && i.rowId !== form.rowId);
  }, [form.catCode, form.subCatCode, form.rowId, items, generatedMastCode]);

  const isValid = form.groups.length > 0 && form.category && form.catCode.length === 2 && form.subCategory && form.subCatCode.length === 2;

  // --- Actions ---
  const handleSort = (key: keyof MasterCode) => {
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
      case 'PK': return 'bg-gray-100 text-gray-600 border-gray-200'; 
      case 'SP': return 'bg-red-100 text-red-700 border-red-200'; 
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const openModal = (item: MasterCode | null = null) => {
    if (item) {
      setForm({ ...item });
    } else {
      setForm({ rowId: null, groups: [], category: '', catCode: '', subCategory: '', subCatCode: '', note: '' });
    }
    setShowModal(true);
  };

  const toggleGroupInForm = (g: string) => {
    setForm((prev: any) => {
      if (prev.groups.includes(g)) return { ...prev, groups: prev.groups.filter((x: string) => x !== g) };
      return { ...prev, groups: [...prev.groups, g] };
    });
  };

  const saveItem = () => {
    if (!isValid || isDuplicate) return;
    const now = new Date().toISOString().split('T')[0];
    const code = generatedMastCode;
    
    if (form.rowId) {
      setItems(prev => prev.map(i => i.rowId === form.rowId ? { ...form, mastCode: code, updatedAt: now } : i));
    } else {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.rowId)) + 1 : 1;
      setItems(prev => [{ ...form, rowId: newId, mastCode: code, updatedAt: now, updatedBy: 'Admin' }, ...prev]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const deleteItem = (id: number) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#BE123C', confirmButtonText: 'Yes, delete it!' }).then((result) => {
      if (result.isConfirmed) {
        setItems(prev => prev.filter(i => i.rowId !== id));
        Swal.fire({ title: 'Deleted!', text: 'Code has been deleted.', icon: 'success', confirmButtonColor: '#0F172A' });
      }
    });
  };

  // Group Management
  const addGroup = () => {
    if (newGroup && !groups.includes(newGroup.toUpperCase())) {
      setGroups(prev => [...prev, newGroup.toUpperCase()]);
      setNewGroup('');
    }
  };

  const removeGroup = (g: string) => {
    setGroups(prev => prev.filter(x => x !== g));
  };

  const startEditGroup = (g: string) => {
    setEditingGroup(g);
    setEditGroupText(g);
  };

  const saveEditGroup = () => {
    if (editGroupText && !groups.includes(editGroupText.toUpperCase())) {
      const oldGroup = editingGroup;
      const newName = editGroupText.toUpperCase();
      
      setGroups(prev => prev.map(g => g === oldGroup ? newName : g));
      setItems(prev => prev.map(item => {
        if (item.groups.includes(oldGroup!)) {
          return { ...item, groups: item.groups.map(g => g === oldGroup ? newName : g) };
        }
        return item;
      }));

      if (activeGroup === oldGroup) setActiveGroup(newName);
      setEditingGroup(null);
      setEditGroupText('');
    } else {
        setEditingGroup(null);
    }
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const processExcelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    Swal.fire({ icon: 'success', title: 'Load Successful', text: `Loaded data.`, confirmButtonColor: '#0F172A', timer: 1500 });
    if (event.target) event.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F8F4]">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F8F4]/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <QrCode size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">MASTER</span> <span className="font-semibold">CODE</span>
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs mt-1 font-sans">
                <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">System Configuration</span>
              </p>
              <button onClick={() => setShowGroupModal(true)} className="text-[10px] bg-white border border-gray-200 text-slate-500 px-2 py-0.5 rounded hover:bg-slate-900 hover:text-white transition flex items-center gap-1 mt-1 shadow-sm font-mono">
                <Settings2 size={12} /> Config Groups
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> MASTER LIST
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
            <KPICard title="Total Items" value={stats.total} icon={Layers} iconColor="text-blue-500" subValue="All Codes" />
            <KPICard title="Finished Goods" value={stats.fg} icon={Package} iconColor="text-[#D4AF37]" subValue="Ready to Sell" />
            <KPICard title="Raw Materials" value={stats.rm} icon={Layers} iconColor="text-green-600" subValue="Components" />
            <KPICard title="New This Month" value={stats.new} icon={Plus} iconColor="text-purple-600" subValue="Created Recently" />
          </div>

          {/* Content Area */}
          <div className="bg-white/80 backdrop-blur-xl rounded-none shadow-sm border border-white/60 flex flex-col overflow-hidden min-h-[600px] mx-8 mb-8">
            
            {/* Toolbar */}
            {activeTab === 'list' && (
              <div className="px-6 py-3 border-b border-gray-100/50 flex flex-col lg:flex-row items-center justify-between gap-3 bg-white/40 backdrop-blur-sm">
                <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1 p-1 bg-gray-100/60 rounded-lg border border-white/50 backdrop-blur-sm shrink-0">
                    {groups.map(g => (
                      <button key={g} onClick={() => { setActiveGroup(g); setCurrentPage(1); }} 
                        className={`flex items-center gap-1.5 capitalize font-mono px-2.5 py-1.5 text-xs rounded-md transition-all ${activeGroup === g ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
                        <span>{g}</span>
                        <span className={`text-[9px] h-4 min-w-[16px] flex items-center justify-center rounded-full ${activeGroup === g ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {g === 'All' ? items.length : items.filter(i => i.groups.includes(g)).length}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block shrink-0"></div>

                  <div className="relative w-full lg:w-64 shrink-0">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Code / Name..." className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60 backdrop-blur-sm transition-colors font-mono" />
                  </div>
                </div>
                <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                  <button onClick={handleExcelImport} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F1E1B]/10 text-[#1F1E1B] hover:bg-[#1F1E1B]/20 shadow-sm transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <UploadCloud size={16} /> Upload
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={processExcelFile} />
                  </button>
                  <button onClick={() => openModal()} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={16} /> NEW CODE
                  </button>
                </div>
              </div>
            )}

            {/* List View */}
            {activeTab === 'list' && (
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('mastCode')}>Master Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Group</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 cursor-pointer" onClick={() => handleSort('subCategory')}>Sub Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Sub</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Description / Note</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center">Updated</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedItems.map(item => (
                      <tr key={item.rowId} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono font-bold text-xs text-[#D4AF37]">{item.mastCode}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {item.groups.map(g => <span key={g} className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeClass(g)}`}>{g}</span>)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-900">{item.category}</td>
                        <td className="px-6 py-4 text-center text-xs font-mono font-bold text-slate-500 bg-white/50 rounded">{item.catCode}</td>
                        <td className="px-6 py-4 text-xs text-slate-900">{item.subCategory}</td>
                        <td className="px-6 py-4 text-center text-xs font-mono font-bold text-slate-500 bg-white/50 rounded">{item.subCatCode}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 italic max-w-[200px] truncate" title={item.note}>{item.note || '-'}</td>
                        <td className="px-6 py-4 text-center text-[10px] text-gray-400 font-mono">
                          <div>{item.updatedAt.split(' ')[0]}</div>
                          <div className="text-[9px] opacity-70">{item.updatedBy.split('@')[0]}</div>
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
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Item Distribution by Type</h3>
                    <div className="flex-grow relative flex items-center justify-center">
                      <Doughnut 
                        data={{
                          labels: ['FG', 'RM', 'WIP', 'PK', 'SP'],
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
                  <div className="bg-white/70 backdrop-blur-xl p-6 rounded-none border border-white/60 shadow-sm h-96 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Top 10 High Value Materials</h3>
                    <div className="flex-grow relative flex items-center justify-center">
                      <Bar 
                        data={{
                          labels: items.slice(0, 5).map(i => i.mastCode),
                          datasets: [{
                            label: 'Est. Value',
                            data: items.slice(0, 5).map(() => Math.floor(Math.random() * 1000)),
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
              <div className="px-6 py-4 border-t border-gray-100/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold font-mono">
                  <span>Show</span>
                  <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white/80 border border-gray-200/60 rounded-md px-2 py-1 focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                    <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500">Previous</button>
                  <span className="text-xs font-bold text-slate-900 px-2 bg-white/80 border border-gray-200/60 py-2 rounded-lg">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200/60 bg-white/80 hover:bg-white disabled:opacity-50 transition-colors text-slate-500">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title={form.rowId ? 'Edit Information' : 'New Information'}>
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                {form.rowId ? 'Edit Information' : 'New Information'}
              </h3>
              <p className="text-slate-500 text-[10px] font-medium tracking-wide uppercase font-mono">Fill in the details below</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9F8F4] font-sans space-y-6">
          {/* Groups */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest font-mono">Group Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {groups.filter(g => g !== 'All').map(g => (
                <button key={g} onClick={() => toggleGroupInForm(g)} 
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border font-mono ${form.groups.includes(g) ? 'bg-slate-900 text-[#D4AF37] border-slate-900 shadow-md' : 'bg-white text-slate-500 border-transparent hover:border-[#D4AF37]'}`}>
                  {form.groups.includes(g) ? <CheckCircle size={12} /> : <Circle size={12} />} {g}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#D4AF37]/20 w-full"></div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-900 uppercase mb-1 tracking-wider font-mono">Category Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-slate-400"><Tag size={14} /></div>
                <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Table..." 
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm font-sans" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] uppercase mb-1 tracking-wider font-mono">Code <span className="text-red-500">*</span></label>
              <input type="text" maxLength={2} value={form.catCode} onChange={e => setForm({...form, catCode: e.target.value.toUpperCase()})}
                className="w-full text-center py-2 text-sm font-mono font-bold rounded-lg uppercase focus:outline-none border bg-white text-slate-900 border-gray-200 focus:border-[#D4AF37]" placeholder="XX" />
            </div>
          </div>

          {/* Sub Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-900 uppercase mb-1 tracking-wider font-mono">Sub Category <span className="text-red-500">*</span></label>
              <input type="text" value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} placeholder="e.g. Dining..." 
                className="w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm font-sans" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase mb-1 tracking-wider font-mono">Sub Code <span className="text-red-500">*</span></label>
              <input type="text" maxLength={2} value={form.subCatCode} onChange={e => setForm({...form, subCatCode: e.target.value.toUpperCase()})} placeholder="XX"
                className="w-full text-center py-2 text-sm font-mono font-bold rounded-lg uppercase focus:outline-none border bg-white text-slate-900 border-gray-200 focus:border-[#D4AF37]" />
            </div>
          </div>

          {isDuplicate && (
            <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium animate-pulse">
              <AlertOctagon size={18} />
              <div>
                <span className="block opacity-80 uppercase font-bold tracking-wider text-[10px] font-mono">Duplicate Found</span>
                Code already exists: <b className="font-mono text-sm">{generatedMastCode}</b>
              </div>
            </div>
          )}

          {/* Preview & Note */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-900 uppercase mb-1 tracking-wider font-mono">Note</label>
              <textarea rows={2} value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Additional details..." className="w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] shadow-sm font-sans"></textarea>
            </div>
            <div className="w-full md:w-40 bg-slate-900 rounded-xl shadow-lg p-1 shrink-0">
              <div className="h-full border border-white/10 rounded-lg flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37] opacity-20 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <span className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold mb-1 opacity-80 font-mono">PREVIEW</span>
                <div className="text-2xl font-mono font-black text-white flex gap-0.5 z-10">
                  <span>{form.catCode || '__'}</span><span className="text-[#D4AF37]">{form.subCatCode || '__'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#D4AF37]/10 bg-white flex justify-between items-center shrink-0">
          <button onClick={() => setForm({ rowId: null, groups: [], category: '', catCode: '', subCategory: '', subCatCode: '', note: '' })} className="text-slate-500 hover:text-red-500 text-xs font-bold flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition uppercase tracking-wide font-mono">
            <RotateCcw size={14} /> Reset
          </button>
          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-lg transition font-mono">Cancel</button>
            <button onClick={saveItem} disabled={!isValid || isDuplicate} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 tracking-widest uppercase transition-all font-mono ${(!isValid || isDuplicate) ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#D4AF37] text-slate-900 hover:bg-white hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]'}`}>
              <CheckCircle size={16} /> Save Data
            </button>
          </div>
        </div>
      </DraggableModal>

      {/* Group Manager Modal */}
      <DraggableModal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} title="Manage Groups" width="max-w-sm">
        <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Manage Groups</h3>
          <button onClick={() => setShowGroupModal(false)}><X size={18} /></button>
        </div>
        <div className="p-4 bg-[#F9F8F4] space-y-3">
          <div className="flex gap-2">
            {editingGroup ? (
              <>
                <input value={editGroupText} onChange={e => setEditGroupText(e.target.value.toUpperCase())} className="w-full bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-sm focus:outline-none" placeholder="Rename Group" />
                <button onClick={saveEditGroup} className="px-2 bg-green-600 text-white rounded-lg font-bold"><Check size={14} /></button>
                <button onClick={() => { setEditingGroup(null); setEditGroupText(''); }} className="px-2 bg-gray-400 text-white rounded-lg font-bold"><X size={14} /></button>
              </>
            ) : (
              <>
                <input value={newGroup} onChange={e => setNewGroup(e.target.value.toUpperCase())} className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none" placeholder="New Group (e.g. AS)" />
                <button onClick={addGroup} className="px-3 bg-[#D4AF37] text-white rounded-lg font-bold text-xs">ADD</button>
              </>
            )}
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {groups.filter(x => x !== 'All').map(g => (
              <div key={g} className="flex justify-between items-center p-2 bg-white rounded border border-gray-100 group">
                <span className="font-mono text-xs font-bold text-slate-900 truncate flex-1">{g}</span>
                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  <button onClick={() => startEditGroup(g)} className="text-blue-400 hover:text-blue-600 p-1"><Edit size={12} /></button>
                  <button onClick={() => removeGroup(g)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={() => setShowGroupModal(false)} className="px-5 py-2 text-slate-500 text-xs font-bold hover:bg-gray-200 rounded-lg">Close</button>
        </div>
      </DraggableModal>
    </div>
  );
}
