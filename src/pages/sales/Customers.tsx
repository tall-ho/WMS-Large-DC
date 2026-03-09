import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, List, LayoutDashboard, Activity, Building2, User, Search, 
  UploadCloud, Plus, Eye, Pencil, Trash2, Save, X, Info, MapPin, 
  Coins, ChevronLeft, ChevronRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- SHARED COMPONENTS ---
const KpiCard = ({ title, val, color, icon: Icon }: { title: string, val: string | number, color: string, icon: any }) => (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-white/60 relative overflow-hidden group h-full cursor-pointer">
        <div className="absolute -right-6 -bottom-6 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0" style={{color: color}}>
            <Icon size={110} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono opacity-90 truncate">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-2xl font-extrabold tracking-tight font-mono leading-tight truncate" style={{color: color}}>{val}</h4>
                </div>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md border border-white/60" style={{backgroundColor: color + '22'}}>
                <Icon size={20} color={color} />
            </div>
        </div>
        <div className="w-full bg-white/50 rounded-full h-1 mt-3 overflow-hidden relative z-10">
            <div className="h-full rounded-full transition-all duration-1000" style={{width: '70%', backgroundColor: color}}></div>
        </div>
    </div>
);

export default function Customers() {
    // Permissions: Default to DEV
    const [userRole] = useState('DEV'); 
    const hasPermission = (action: string) => {
        if (userRole === 'DEV') return true;
        return false;
    };

    // --- State ---
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [customerTypeFilter, setCustomerTypeFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalReadOnly, setModalReadOnly] = useState(false);
    const [activeFormTab, setActiveFormTab] = useState('general');
    const [customers, setCustomers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    
    const [form, setForm] = useState<any>({});

    const filterCategories = ['All', 'MT', 'Dealer', 'Online', 'Project', 'GOV', 'OTH'];
    const customerTypes = ['MT', 'Dealer', 'Online', 'Project', 'GOV', 'OTH'];
    
    const formTabs = [
        { id: 'general', label: 'General Info', icon: Info },
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'financial', label: 'Financial', icon: Coins },
        { id: 'contact', label: 'Contact Person', icon: User },
    ];

    // Mock Data
    useEffect(() => {
        setCustomers([
            { id: 1, customerID: 'MT-260001', customerName: 'HomePro (Public Company)', customerType: 'MT', contactName: 'Khun Nareerat', phone: '02-832-1000', status: 'Active', creditTerm: 60, taxID: '0105555000123', creditLimit: 5000000, billingAddress: '97/11 Moo 4, Klong Nueng, Klong Luang, Pathumthani', shippingAddress: 'Bang Na Warehouse, Bangkok', email: 'procurement@homepro.co.th', mobile: '081-XXX-XXXX', contactPosition: 'Purchasing Manager' },
            { id: 2, customerID: 'DL-001', customerName: 'Index Living Mall', customerType: 'MT', contactName: 'Khun Weerawat', phone: '02-417-1111', status: 'Active', creditTerm: 60, taxID: '0105555000456', creditLimit: 3000000, billingAddress: 'Index Living Mall HQ, Bangkok', shippingAddress: 'Main Warehouse, Samut Sakhon', email: 'weerawat@index.co.th', mobile: '089-XXX-XXXX', contactPosition: 'Supply Chain Manager' },
            { id: 3, customerID: 'PJ-2026-001', customerName: 'Origin Condo Sukhumvit', customerType: 'Project', contactName: 'Ploy', phone: '090-XXX-XXXX', status: 'Active', creditTerm: 45, taxID: '0102233445566', creditLimit: 1000000, billingAddress: 'Origin Property PLC, Sukhumvit', shippingAddress: 'Project Site, Soi 24', email: 'ploy@origin.co.th', mobile: '090-XXX-XXXX', contactPosition: 'Project Coordinator' }
        ]);
    }, []);

    // --- Computed ---
    const filteredCustomers = useMemo(() => {
        let data = customers;
        if (customerTypeFilter !== 'All') data = data.filter(c => c.customerType === customerTypeFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(c => (c.customerName + c.customerID + (c.contactName || '')).toLowerCase().includes(q));
        }
        return data;
    }, [customers, customerTypeFilter, searchQuery]);

    const paginatedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

    const getFilterCount = (t: string) => t === 'All' ? customers.length : customers.filter(c => c.customerType === t).length;
    const getTypeClass = (t: string) => {
        const map: Record<string, string> = { 'MT': 'bg-[#3A3659]/10 text-[#3A3659]', 'Project': 'bg-[#A66382]/10 text-[#A66382]', 'GOV': 'bg-blue-50 text-blue-700', 'OTH': 'bg-gray-100 text-gray-500' };
        return map[t] || 'bg-gray-100';
    };

    const openModal = () => { 
        setForm({ customerType: 'MT', status: 'Active', creditTerm: 30, billingAddress: '', shippingAddress: '', contactName: '', mobile: '', contactPosition: '', creditLimit: 0, paymentMethod: 'Transfer' }); 
        setModalReadOnly(false);
        setShowModal(true); 
    };
    
    const viewCustomer = (c: any) => { 
        setForm({...c}); 
        setModalReadOnly(true);
        setShowModal(true); 
    };
    
    const enableEditing = () => setModalReadOnly(false);
    const closeModal = () => setShowModal(false);
    
    const saveCustomer = () => { 
        setShowModal(false); 
        Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1000, showConfirmButton: false }); 
    };
    
    const deleteCustomer = () => {
        Swal.fire({ 
            title: 'Delete Customer?', 
            text: `Are you sure you want to delete ${form.customerName}?`,
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#B43B42',
            confirmButtonText: 'Yes, Delete it'
        }).then(r => {
            if (r.isConfirmed) {
                setShowModal(false);
                Swal.fire({title: 'Deleted', icon: 'success', timer: 1000, showConfirmButton: false});
            }
        }); 
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-[#F9F8F4]">
            {/* Header */}
            <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md flex-shrink-0 border border-white/20">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight font-mono uppercase leading-none">
                            CUSTOMER DATABASE
                        </h1>
                        <div className="flex items-center gap-2">
                             <p className="text-slate-500 text-[10px] uppercase tracking-widest font-sans mt-0.5">
                                 THAI MUNGMEE MES
                             </p>
                             <span className="text-[9px] bg-slate-900 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold uppercase ml-2">DEV MODE</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex bg-[#BFBAA8] p-0.5 border border-white/20 shadow-sm w-full md:w-fit flex-shrink-0 rounded-lg overflow-hidden">
                    <button onClick={() => setActiveTab('list')} className={`px-4 py-1.5 text-[10px] font-bold transition-all flex items-center gap-2 font-mono uppercase rounded-md ${activeTab === 'list' ? 'bg-[#58594D] text-white shadow-sm' : 'text-white/80 hover:bg-white/10'}`}>
                        <List size={12} /> LIST VIEW
                    </button>
                    <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 text-[10px] font-bold transition-all flex items-center gap-2 font-mono uppercase rounded-md ${activeTab === 'dashboard' ? 'bg-[#58594D] text-white shadow-sm' : 'text-white/80 hover:bg-white/10'}`}>
                        <LayoutDashboard size={12} /> ANALYTICS
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-hidden relative flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    {activeTab === 'list' && (
                        <div className="flex flex-col h-full">
                            {/* KPI Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pt-6 mb-6">
                                <KpiCard title="Total Accounts" val={customers.length} color="#809BBF" icon={Users} />
                                <KpiCard title="Active Deals" val={customers.length} color="#8A8C51" icon={Activity} />
                                <KpiCard title="MT Accounts" val="2" color="#3A3659" icon={Building2} />
                                <KpiCard title="Retail Accounts" val="1" color="#A66382" icon={User} />
                            </div>

                            {/* Main Content Area */}
                            <div className="flex flex-col flex-1 bg-white border-t border-gray-100 overflow-hidden">
                                <div className="px-6 py-3 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-3 bg-[#F8FAFC]">
                                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                                        <div className="flex items-center gap-0.5 p-0.5 bg-gray-200/60 rounded-lg shrink-0">
                                            {filterCategories.map(type => (
                                                <button key={type} onClick={() => {setCustomerTypeFilter(type); setCurrentPage(1);}} 
                                                    className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all flex items-center gap-1 ${customerTypeFilter === type ? 'bg-slate-500/80 text-white' : 'text-slate-500 hover:bg-white/50'}`}>
                                                    <span>{type}</span>
                                                    <span className={`flex items-center justify-center h-3.5 min-w-[14px] px-1 rounded-full text-[8px] ${customerTypeFilter === type ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-500'}`}>{getFilterCount(type)}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative w-40 shrink-0">
                                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} placeholder="Search..." className="w-full pl-8 pr-4 py-1.5 text-[11px] rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] bg-white font-mono" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#1F1E1B]/10 text-[#1F1E1B] hover:bg-[#1F1E1B]/20 transition-all flex items-center gap-1 font-mono uppercase whitespace-nowrap">
                                            <UploadCloud size={14} /> IMPORT
                                        </button>
                                        <button onClick={openModal} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 shadow-sm transition-all flex items-center gap-1 font-mono uppercase whitespace-nowrap">
                                            <Plus size={14} /> NEW CUSTOMER
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-auto custom-scrollbar flex-1 min-h-0">
                                    <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
                                        <thead className="sticky top-0 z-10">
                                            <tr>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono">ID</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono">Company Name</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono text-center">Type</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono">Contact</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono">Phone</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono text-center">Term</th>
                                                <th className="text-[11px] uppercase tracking-wider text-slate-900 px-4 py-3 font-extrabold bg-slate-100/50 border-b-2 border-[#D4AF37] font-mono text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {paginatedCustomers.map(cust => (
                                                <tr key={cust.id} className="hover:bg-[#D4AF37]/5 transition-colors">
                                                    <td className="px-4 py-3 text-xs font-mono font-bold text-[#D4AF37] border-b border-slate-100">{cust.customerID}</td>
                                                    <td className="px-4 py-3 border-b border-slate-100">
                                                        <div className="font-bold text-slate-900 text-sm">{cust.customerName}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">{cust.taxID || '-'}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center border-b border-slate-100">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${getTypeClass(cust.customerType)}`}>{cust.customerType}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs font-semibold border-b border-slate-100">{cust.contactName}</td>
                                                    <td className="px-4 py-3 text-xs font-mono text-slate-500 border-b border-slate-100">{cust.phone}</td>
                                                    <td className="px-4 py-3 text-center font-mono text-xs font-bold border-b border-slate-100">{cust.creditTerm}d</td>
                                                    <td className="px-4 py-3 text-center border-b border-slate-100">
                                                        <button onClick={() => viewCustomer(cust)} className="p-2 text-gray-400 hover:text-slate-900 transition-all" title="View Profile">
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold font-mono">
                                        <span>Show</span>
                                        <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-white border border-gray-200 rounded px-1.5 py-0.5 outline-none">
                                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                                        </select>
                                        <span>entries</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                         <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
                                         <span className="text-[10px] font-bold text-slate-900 px-2">Page {currentPage} / {totalPages}</span>
                                         <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Customer Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={closeModal}>
                        <div className="bg-[#F9F8F4] w-full max-w-[1100px] max-h-[90vh] rounded-2xl shadow-2xl border-t-[6px] border-[#D4AF37] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
                                        {modalReadOnly ? <Eye size={24} /> : (form.id ? <Pencil size={24} /> : <User size={24} />)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                            {modalReadOnly ? 'Customer Profile' : (form.id ? 'Edit Customer' : 'New Customer')}
                                        </h3>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5"><span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">Code: {form.customerID || 'AUTO'}</span></div>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="text-gray-400 hover:text-black transition-all"><X size={24} /></button>
                            </div>
                            <div className="flex-1 flex overflow-hidden">
                                 <div className="w-56 bg-gray-50 border-r border-gray-100 p-3 space-y-1 shrink-0 font-mono text-[11px] uppercase font-bold overflow-y-auto">
                                     {formTabs.map(tab => (
                                         <button key={tab.id} onClick={() => setActiveFormTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeFormTab === tab.id ? 'bg-slate-900 text-[#D4AF37] shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
                                             <tab.icon size={14} /> {tab.label}
                                         </button>
                                     ))}
                                 </div>
                                 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9F8F4] font-sans">
                                      <div className="max-w-2xl mx-auto space-y-6">
                                          {/* General Tab */}
                                          <div style={{ display: activeFormTab === 'general' ? 'block' : 'none' }} className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5">
                                              <h4 className="text-[10px] font-black text-slate-500 uppercase border-b border-gray-50 pb-2 tracking-widest">Basic Information</h4>
                                              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                  <div className="col-span-2">
                                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Company Name</label>
                                                      <input value={form.customerName || ''} onChange={e => setForm({...form, customerName: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-sm font-bold focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g. HomePro PCL" />
                                                  </div>
                                                  <div>
                                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Customer Type</label>
                                                      <select value={form.customerType || 'MT'} onChange={e => setForm({...form, customerType: e.target.value})} disabled={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-bold cursor-pointer focus:outline-none focus:border-[#D4AF37]">
                                                          {customerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                      </select>
                                                  </div>
                                                  <div>
                                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Tax ID</label>
                                                      <input value={form.taxID || ''} onChange={e => setForm({...form, taxID: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D4AF37]" />
                                                  </div>
                                                  <div>
                                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Email</label>
                                                      <input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" />
                                                  </div>
                                                  <div>
                                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Phone</label>
                                                      <input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D4AF37]" />
                                                  </div>
                                              </div>
                                          </div>
                                          
                                          {/* Address Tab */}
                                          {activeFormTab === 'address' && (
                                              <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                  <h4 className="text-[10px] font-black text-slate-500 uppercase border-b border-gray-50 pb-2 tracking-widest font-mono">Address Information</h4>
                                                  <div className="space-y-4">
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Billing Address</label>
                                                          <textarea rows={3} value={form.billingAddress || ''} onChange={e => setForm({...form, billingAddress: e.target.value})} readOnly={modalReadOnly} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" placeholder="Enter billing address..." />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Shipping Address</label>
                                                          <textarea rows={3} value={form.shippingAddress || ''} onChange={e => setForm({...form, shippingAddress: e.target.value})} readOnly={modalReadOnly} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none" placeholder="Enter shipping address..." />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Google Maps Link</label>
                                                          <div className="flex items-center gap-2">
                                                              <MapPin size={14} className="text-slate-400" />
                                                              <input value={form.mapsLink || ''} onChange={e => setForm({...form, mapsLink: e.target.value})} readOnly={modalReadOnly} className="flex-1 bg-transparent border-b border-gray-200 px-2 py-1 text-xs text-blue-600 underline cursor-pointer focus:outline-none focus:border-[#D4AF37]" placeholder="https://maps.google.com/..." />
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          )}

                                          {/* Financial Tab */}
                                          {activeFormTab === 'financial' && (
                                              <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                  <h4 className="text-[10px] font-black text-slate-500 uppercase border-b border-gray-50 pb-2 tracking-widest font-mono">Financial Details</h4>
                                                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Tax ID</label>
                                                          <input value={form.taxID || ''} onChange={e => setForm({...form, taxID: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Branch (Head/No.)</label>
                                                          <input value={form.branch || ''} onChange={e => setForm({...form, branch: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D4AF37]" placeholder="00000" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Credit Term (Days)</label>
                                                          <input type="number" value={form.creditTerm || ''} onChange={e => setForm({...form, creditTerm: Number(e.target.value)})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Credit Limit</label>
                                                          <input type="number" value={form.creditLimit || ''} onChange={e => setForm({...form, creditLimit: Number(e.target.value)})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Payment Method</label>
                                                          <select value={form.paymentMethod || 'Transfer'} onChange={e => setForm({...form, paymentMethod: e.target.value})} disabled={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-bold cursor-pointer focus:outline-none focus:border-[#D4AF37]">
                                                              <option value="Transfer">Bank Transfer</option>
                                                              <option value="Cheque">Cheque</option>
                                                              <option value="Cash">Cash</option>
                                                          </select>
                                                      </div>
                                                  </div>
                                              </div>
                                          )}

                                          {/* Contact Tab */}
                                          {activeFormTab === 'contact' && (
                                              <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                  <h4 className="text-[10px] font-black text-slate-500 uppercase border-b border-gray-50 pb-2 tracking-widest font-mono">Primary Contact Person</h4>
                                                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                      <div className="col-span-2">
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Contact Name</label>
                                                          <input value={form.contactName || ''} onChange={e => setForm({...form, contactName: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Position</label>
                                                          <input value={form.contactPosition || ''} onChange={e => setForm({...form, contactPosition: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Mobile Phone</label>
                                                          <input value={form.mobile || ''} onChange={e => setForm({...form, mobile: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Email</label>
                                                          <input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                      <div>
                                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Line ID</label>
                                                          <input value={form.lineId || ''} onChange={e => setForm({...form, lineId: e.target.value})} readOnly={modalReadOnly} className="w-full bg-transparent border-b border-gray-200 px-2 py-1 text-xs text-green-600 font-bold focus:outline-none focus:border-[#D4AF37]" />
                                                      </div>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                 </div>
                            </div>
                            <div className="p-5 border-t bg-white flex justify-between items-center shrink-0">
                                 <div className="flex gap-2">
                                     {modalReadOnly && hasPermission('DELETE') && (
                                         <button onClick={deleteCustomer} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 uppercase font-mono">
                                             <Trash2 size={14} /> Delete
                                         </button>
                                     )}
                                 </div>
                                 <div className="flex gap-3">
                                      <button onClick={closeModal} className="px-5 py-2 text-slate-500 hover:text-black text-[10px] font-bold uppercase transition font-mono tracking-widest">Cancel</button>
                                      
                                      {modalReadOnly ? (
                                          hasPermission('EDIT') && (
                                              <button onClick={enableEditing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono">
                                                  <Pencil size={14} /> Edit Customer
                                              </button>
                                          )
                                      ) : (
                                          <button onClick={saveCustomer} disabled={!form.customerName} className="px-6 py-2 bg-slate-900 text-[#D4AF37] text-[10px] font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono disabled:opacity-50">
                                              <Save size={14} /> Save Record
                                          </button>
                                      )}
                                 </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
