import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building, 
  FileText, 
  CreditCard, 
  User, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle,
  Truck,
  Package,
  Clock
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';

// --- Types ---
interface Supplier {
  id: number;
  code: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Blacklist';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  creditTerm: string;
  taxId: string;
  rating: number;
}

// --- Mock Data ---
const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, code: 'SUP-001', name: 'Thai Steel Co., Ltd.', type: 'Raw Material', status: 'Active', contactPerson: 'Mr. Somchai', phone: '02-123-4567', email: 'sales@thaisteel.com', address: '123 Industrial Estate, Rayong', creditTerm: '30 Days', taxId: '1234567890123', rating: 4.8 },
  { id: 2, code: 'SUP-002', name: 'Global Wood Supply', type: 'Raw Material', status: 'Active', contactPerson: 'Ms. Ratana', phone: '02-987-6543', email: 'contact@globalwood.com', address: '456 Wood Street, Bangna, Bangkok', creditTerm: '60 Days', taxId: '9876543210987', rating: 4.5 },
  { id: 3, code: 'SUP-003', name: 'Fast Logistics', type: 'Service', status: 'Active', contactPerson: 'Mr. David', phone: '081-234-5678', email: 'david@fastlog.com', address: '789 Logistics Park, Chonburi', creditTerm: '15 Days', taxId: '5678901234567', rating: 4.2 },
  { id: 4, code: 'SUP-004', name: 'Tech Parts Solution', type: 'Parts', status: 'Inactive', contactPerson: 'Ms. Suda', phone: '02-555-5555', email: 'suda@techparts.com', address: '321 Tech Valley, Pathum Thani', creditTerm: 'Cash', taxId: '1112223334445', rating: 3.5 },
  { id: 5, code: 'SUP-005', name: 'Office Depot', type: 'Consumable', status: 'Active', contactPerson: 'Sales Team', phone: '02-888-8888', email: 'order@officedepot.com', address: 'Central World, Bangkok', creditTerm: '30 Days', taxId: '5556667778889', rating: 4.0 },
];

export default function SupplierDatabase() {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeModalTab, setActiveModalTab] = useState('General Info');
  const [formData, setFormData] = useState<any>({
    name: '', type: 'Raw Material', status: 'Active', contactPerson: '', phone: '', email: '', 
    address: '', creditTerm: '30 Days', taxId: '', rating: 5
  });

  // --- Computed ---
  const filteredSuppliers = useMemo(() => {
    let res = suppliers;
    if (typeFilter !== 'All') res = res.filter(s => s.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q)
      );
    }
    return res;
  }, [suppliers, typeFilter, searchQuery]);

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(start, start + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;

  const stats = useMemo(() => ({
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'Active').length,
    inactive: suppliers.filter(s => s.status === 'Inactive').length,
    rawMaterial: suppliers.filter(s => s.type === 'Raw Material').length
  }), [suppliers]);

  // --- Actions ---
  const openModal = (supplier: Supplier | null = null, mode: 'create' | 'edit' | 'view' = 'create') => {
    setModalMode(mode);
    setSelectedSupplier(supplier);
    if (supplier) {
      setFormData(JSON.parse(JSON.stringify(supplier)));
    } else {
      setFormData({
        name: '', type: 'Raw Material', status: 'Active', contactPerson: '', phone: '', email: '', 
        address: '', creditTerm: '30 Days', taxId: '', rating: 5
      });
    }
    setActiveModalTab('General Info');
    setShowModal(true);
  };

  const saveSupplier = () => {
    if (modalMode === 'edit' && selectedSupplier) {
      setSuppliers(prev => prev.map(s => s.id === selectedSupplier.id ? { ...formData, id: s.id, code: s.code } : s));
    } else {
      const newSupplier = { 
        id: Date.now(), 
        code: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`, 
        ...formData 
      };
      setSuppliers(prev => [newSupplier, ...prev]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const deleteSupplier = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BE123C',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        if (showModal) setShowModal(false);
        Swal.fire('Deleted!', 'Supplier has been deleted.', 'success');
      }
    });
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
              <span className="font-light opacity-50">SUPPLIER</span> <span className="font-semibold">DATABASE</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Vendor Management</span>
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Filter size={14} /> LIST VIEW
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${activeTab === 'analytics' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <Package size={14} /> ANALYTICS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="Total Suppliers" value={stats.total} icon={Building} iconColor="text-blue-600" subValue="Registered Vendors" />
            <KPICard title="Active Suppliers" value={stats.active} icon={CheckCircle} iconColor="text-green-600" subValue="Ready to Order" />
            <KPICard title="Raw Material" value={stats.rawMaterial} icon={Package} iconColor="text-orange-500" subValue="Key Partners" />
            <KPICard title="Inactive" value={stats.inactive} icon={X} iconColor="text-red-500" subValue="Suspended" />
          </div>

          {/* Content Area */}
          <div className="bg-white/80 backdrop-blur-xl rounded-none shadow-sm border border-white/60 flex flex-col overflow-hidden min-h-[600px] mx-8 mb-8">
            
            {/* Toolbar */}
            {activeTab === 'list' && (
              <div className="px-6 py-4 border-b border-gray-100/50 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 bg-white/40 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:flex-1 lg:min-w-0 mr-auto flex-wrap">
                  <div className="relative w-full md:w-64 flex-shrink-0">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search Supplier..." 
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60 backdrop-blur-sm transition-colors font-mono" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <select 
                      value={typeFilter} 
                      onChange={(e) => setTypeFilter(e.target.value)} 
                      className="bg-white/60 border border-gray-200/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] font-mono cursor-pointer"
                    >
                      <option value="All">All Types</option>
                      <option value="Raw Material">Raw Material</option>
                      <option value="Parts">Parts</option>
                      <option value="Service">Service</option>
                      <option value="Consumable">Consumable</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                  <button onClick={() => openModal(null, 'create')} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                    <Plus size={16} /> New Supplier
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Contact</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Rating</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {paginatedSuppliers.map(supplier => (
                      <tr key={supplier.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">{supplier.code}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{supplier.name}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} className="text-slate-400" /> {supplier.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">{supplier.type}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-700">{supplier.contactPerson}</div>
                          <div className="text-[10px] text-gray-500">{supplier.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-yellow-500 font-bold">
                          {'★'.repeat(Math.round(supplier.rating))}{'☆'.repeat(5 - Math.round(supplier.rating))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            supplier.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                            supplier.status === 'Inactive' ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                            'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(supplier, 'view')} className="p-1.5 rounded bg-white border border-gray-200 hover:text-slate-900 hover:bg-gray-100 transition-colors" title="View">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Analytics View Placeholder */}
            {activeTab === 'analytics' && (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-mono p-8">
                Analytics Module Under Construction
              </div>
            )}

            {/* Pagination */}
            {activeTab === 'list' && (
              <div className="px-6 py-4 border-t border-gray-100/50 flex justify-between items-center bg-white/40 backdrop-blur-sm shrink-0">
                <div className="text-xs text-slate-500 font-bold font-mono">
                  Showing {paginatedSuppliers.length} of {filteredSuppliers.length} entries
                </div>
                {/* Pagination Controls could be added here */}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Draggable Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'create' ? 'New Supplier' : 'Supplier Details'}>
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
              <Building size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                {modalMode === 'create' ? 'New Supplier' : (modalMode === 'edit' ? 'Edit Supplier' : 'Supplier Detail')}
              </h3>
              {selectedSupplier ? (
                <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">{selectedSupplier.code}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">{selectedSupplier.status}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-mono mt-1">NEW ENTRY</div>
              )}
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden bg-[#F9F8F4]">
          {/* Sidebar */}
          <div className="w-60 bg-gray-50/80 border-r border-gray-200 p-4 space-y-2 shrink-0 font-sans overflow-y-auto">
            {['General Info', 'Address', 'Financial', 'Contact Person'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveModalTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold rounded-lg transition-all text-left uppercase tracking-wide ${activeModalTab === tab ? 'bg-slate-900 text-[#D4AF37] shadow-md' : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'}`}
              >
                {tab === 'General Info' && <FileText size={16} />}
                {tab === 'Address' && <MapPin size={16} />}
                {tab === 'Financial' && <CreditCard size={16} />}
                {tab === 'Contact Person' && <User size={16} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {activeModalTab === 'General Info' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Company Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Supplier Type</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                        <option>Raw Material</option><option>Parts</option><option>Service</option><option>Consumable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                        <option>Active</option><option>Inactive</option><option>Blacklist</option>
                      </select>
                    </div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Phone</label><input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Email</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                  </div>
                </div>
              )}

              {activeModalTab === 'Address' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Address Details</h4>
                  <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Full Address</label><textarea rows={4} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] resize-none" /></div>
                </div>
              )}

              {activeModalTab === 'Financial' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Financial Info</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Tax ID</label><input value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Credit Term</label>
                      <select value={formData.creditTerm} onChange={e => setFormData({...formData, creditTerm: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]">
                        <option>Cash</option><option>15 Days</option><option>30 Days</option><option>60 Days</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'Contact Person' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-6 tracking-widest border-b border-gray-100 pb-3">Primary Contact</h4>
                  <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 font-mono">Contact Name</label><input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} disabled={modalMode === 'view'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" /></div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0 z-10 rounded-b-2xl">
          <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 text-xs font-bold hover:bg-gray-200 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Close</button>
          
          {(modalMode === 'create' || modalMode === 'edit') && (
            <button onClick={saveSupplier} className="px-8 py-3 bg-[#403C2A] hover:bg-[#403C2A]/90 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono">
              <CheckCircle size={14} /> Save Supplier
            </button>
          )}

          {modalMode === 'view' && (
            <>
              <button onClick={() => setModalMode('edit')} className="px-6 py-3 bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono flex items-center gap-2">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => deleteSupplier(selectedSupplier?.id as number)} className="px-6 py-3 bg-[#BE123C]/10 text-[#BE123C] hover:bg-[#BE123C] hover:text-white border border-[#BE123C]/20 text-xs font-bold rounded-xl transition duration-300 uppercase tracking-widest font-mono flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}
        </div>
      </DraggableModal>
    </div>
  );
}
