import { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid, 
  List, 
  Thermometer, 
  Snowflake, 
  Sun, 
  Box, 
  Layers, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Package,
  ArrowRight
} from 'lucide-react';
import KPICard from '../../components/KPICard';
import Swal from 'sweetalert2';
import DraggableModal from '../../components/DraggableModal';

// --- Types ---
type StorageType = 'Ambient' | 'Chill' | 'Frozen';

interface Location {
  id: string;
  code: string;
  name: string;
  type: StorageType;
  zone: string;
  aisle: string;
  rack: string;
  level: string;
  capacity: number;
  occupancy: number; // percentage
  temperature: number; // Celsius
  status: 'Active' | 'Maintenance' | 'Full';
}

// --- Mock Data ---
const MOCK_LOCATIONS: Location[] = [
  { id: '1', code: 'WH1-Z1-A01-L1', name: 'Main Warehouse - Ambient A01', type: 'Ambient', zone: 'Z1', aisle: 'A01', rack: 'R01', level: 'L1', capacity: 100, occupancy: 45, temperature: 25, status: 'Active' },
  { id: '2', code: 'WH1-Z1-A01-L2', name: 'Main Warehouse - Ambient A02', type: 'Ambient', zone: 'Z1', aisle: 'A01', rack: 'R01', level: 'L2', capacity: 100, occupancy: 80, temperature: 25, status: 'Active' },
  { id: '3', code: 'WH2-Z2-C01-L1', name: 'Cold Storage - Chill C01', type: 'Chill', zone: 'Z2', aisle: 'C01', rack: 'R05', level: 'L1', capacity: 50, occupancy: 20, temperature: 4, status: 'Active' },
  { id: '4', code: 'WH2-Z2-C02-L1', name: 'Cold Storage - Chill C02', type: 'Chill', zone: 'Z2', aisle: 'C02', rack: 'R06', level: 'L1', capacity: 50, occupancy: 95, temperature: 3, status: 'Full' },
  { id: '5', code: 'WH3-Z3-F01-L1', name: 'Freezer - Frozen F01', type: 'Frozen', zone: 'Z3', aisle: 'F01', rack: 'R10', level: 'L1', capacity: 30, occupancy: 10, temperature: -18, status: 'Active' },
  { id: '6', code: 'WH3-Z3-F01-L2', name: 'Freezer - Frozen F02', type: 'Frozen', zone: 'Z3', aisle: 'F01', rack: 'R10', level: 'L2', capacity: 30, occupancy: 0, temperature: -20, status: 'Maintenance' },
];

export default function LocationsPage() {
  // --- State ---
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<StorageType | 'All'>('All');
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Location>>({
    code: '', name: '', type: 'Ambient', zone: '', aisle: '', rack: '', level: '', capacity: 100, temperature: 25, status: 'Active'
  });

  // --- Computed ---
  const filteredLocations = useMemo(() => {
    let res = locations;
    if (filterType !== 'All') {
      res = res.filter(l => l.type === filterType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      res = res.filter(l => 
        l.code.toLowerCase().includes(q) || 
        l.name.toLowerCase().includes(q) ||
        l.zone.toLowerCase().includes(q)
      );
    }
    return res;
  }, [locations, filterType, searchQuery]);

  const stats = useMemo(() => ({
    total: locations.length,
    ambient: locations.filter(l => l.type === 'Ambient').length,
    chill: locations.filter(l => l.type === 'Chill').length,
    frozen: locations.filter(l => l.type === 'Frozen').length,
    full: locations.filter(l => l.status === 'Full').length,
    maintenance: locations.filter(l => l.status === 'Maintenance').length
  }), [locations]);

  // --- Actions ---
  const openModal = (loc?: Location) => {
    if (loc) {
      setForm({ ...loc });
    } else {
      setForm({ code: '', name: '', type: 'Ambient', zone: '', aisle: '', rack: '', level: '', capacity: 100, temperature: 25, status: 'Active', occupancy: 0 });
    }
    setShowModal(true);
  };

  const saveLocation = () => {
    if (!form.code || !form.name) return;
    
    if (form.id) {
      setLocations(prev => prev.map(l => l.id === form.id ? { ...l, ...form } as Location : l));
    } else {
      const newId = String(locations.length + 1);
      setLocations(prev => [...prev, { ...form, id: newId, occupancy: 0 } as Location]);
    }
    setShowModal(false);
    Swal.fire({ icon: 'success', title: 'Saved Successfully', timer: 1500, showConfirmButton: false });
  };

  const deleteLocation = (id: string) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#BE123C', confirmButtonText: 'Yes, delete it!' }).then((result) => {
      if (result.isConfirmed) {
        setLocations(prev => prev.filter(l => l.id !== id));
        Swal.fire({ title: 'Deleted!', text: 'Location has been deleted.', icon: 'success', confirmButtonColor: '#0F172A' });
      }
    });
  };

  const getTypeIcon = (type: StorageType) => {
    switch(type) {
      case 'Ambient': return <Sun size={16} className="text-orange-500" />;
      case 'Chill': return <Thermometer size={16} className="text-blue-500" />;
      case 'Frozen': return <Snowflake size={16} className="text-cyan-500" />;
    }
  };

  const getTypeColor = (type: StorageType) => {
    switch(type) {
      case 'Ambient': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Chill': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Frozen': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-transparent">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6F36] text-white shadow-lg flex-shrink-0 border border-white/20">
            <MapPin size={28} />
          </div>
          <div>
            <h1 className="text-3xl text-slate-900 tracking-tight whitespace-nowrap font-mono uppercase leading-none">
              <span className="font-light opacity-50">WAREHOUSE</span> <span className="font-semibold">LOCATIONS</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-sans">
              <span className="uppercase tracking-[0.2em]"><span className="font-normal">THAI</span> <span className="font-bold text-[#D4AF37]">MUNGMEE MES</span></span> <span className="opacity-60">--</span> <span className="tracking-normal">Storage Management</span>
            </p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-[#BFBAA8] p-1 border border-gray-200 shadow-sm w-full md:w-fit flex-shrink-0 rounded-none overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${viewMode === 'grid' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <LayoutGrid size={14} /> GRID VIEW
          </button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-wide rounded-none ${viewMode === 'list' ? 'bg-[#58594D] text-white shadow-md' : 'text-white/80 hover:bg-white/20'}`}>
            <List size={14} /> LIST VIEW
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full flex flex-col gap-6 pt-8">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8">
            <KPICard title="Total Locations" value={stats.total} icon={MapPin} iconColor="text-slate-500" subValue="All Zones" />
            <KPICard title="Ambient Storage" value={stats.ambient} icon={Sun} iconColor="text-orange-500" subValue="Normal Temp" />
            <KPICard title="Chill Storage" value={stats.chill} icon={Thermometer} iconColor="text-blue-500" subValue="0°C to 8°C" />
            <KPICard title="Frozen Storage" value={stats.frozen} icon={Snowflake} iconColor="text-cyan-500" subValue="-18°C or lower" />
          </div>

          {/* Toolbar */}
          <div className="mx-8 px-6 py-3 border-b border-gray-100/50 flex flex-col lg:flex-row items-center justify-between gap-3 bg-white/40  rounded-t-xl border border-white/60 shadow-sm">
            <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 p-1 bg-gray-100/60 rounded-lg border border-white/50  shrink-0">
                {['All', 'Ambient', 'Chill', 'Frozen'].map((type) => (
                  <button key={type} onClick={() => setFilterType(type as any)} 
                    className={`flex items-center gap-1.5 capitalize font-mono px-2.5 py-1.5 text-xs rounded-md transition-all ${filterType === type ? 'bg-slate-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
              
              <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block shrink-0"></div>

              <div className="relative w-full lg:w-64 shrink-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Location..." className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-200/60 focus:outline-none focus:border-[#D4AF37] bg-white/60  transition-colors font-mono" />
              </div>
            </div>
            <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
              <button onClick={() => openModal()} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#403C2A] text-white hover:bg-[#403C2A]/90 hover:shadow-lg shadow-md transition-all flex items-center gap-2 font-mono uppercase tracking-wide whitespace-nowrap">
                <Plus size={16} /> ADD LOCATION
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white/80  rounded-b-xl shadow-sm border border-white/60 border-t-0 flex flex-col overflow-hidden min-h-[500px] p-6 mx-8 mb-8">
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredLocations.map(loc => (
                  <div key={loc.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${loc.status === 'Maintenance' ? 'bg-gray-400' : loc.status === 'Full' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${getTypeColor(loc.type)}`}>
                            {getTypeIcon(loc.type)} {loc.type}
                          </span>
                          {loc.status !== 'Active' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                              {loc.status}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm font-mono">{loc.code}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{loc.name}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-900">{loc.temperature}°C</span>
                        <span className="text-[10px] text-slate-400">Temp</span>
                      </div>
                    </div>

                    <div className="pl-2 space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                        <span>Zone: {loc.zone}</span>
                        <span>Aisle: {loc.aisle}</span>
                        <span>Rack: {loc.rack}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="font-bold text-slate-700">Occupancy</span>
                          <span className={`${loc.occupancy > 90 ? 'text-red-500' : 'text-slate-500'}`}>{loc.occupancy}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${getOccupancyColor(loc.occupancy)}`} style={{ width: `${loc.occupancy}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-lg shadow-sm">
                      <button onClick={() => openModal(loc)} className="p-1.5 hover:bg-gray-100 rounded text-slate-500 hover:text-[#D4AF37]"><Edit size={14} /></button>
                      <button onClick={() => deleteLocation(loc.id)} className="p-1.5 hover:bg-gray-100 rounded text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Zone/Aisle</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Temp (°C)</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLocations.map(loc => (
                      <tr key={loc.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 text-xs font-bold font-mono text-slate-900">{loc.code}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{loc.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeColor(loc.type)}`}>
                            {getTypeIcon(loc.type)} {loc.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">{loc.zone} / {loc.aisle} / {loc.rack}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-900 text-center">{loc.temperature}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${getOccupancyColor(loc.occupancy)}`} style={{ width: `${loc.occupancy}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500">{loc.occupancy}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${loc.status === 'Active' ? 'bg-green-100 text-green-700' : loc.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {loc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(loc)} className="p-1 hover:bg-gray-200 rounded text-slate-500 hover:text-[#D4AF37]"><Edit size={14} /></button>
                            <button onClick={() => deleteLocation(loc.id)} className="p-1 hover:bg-gray-200 rounded text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
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

      {/* Create/Edit Modal */}
      <DraggableModal isOpen={showModal} onClose={() => setShowModal(false)} title={form.id ? 'Edit Location' : 'New Location'}>
        <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-xl shadow-lg text-[#D4AF37]">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">
                {form.id ? 'Edit Location' : 'New Location'}
              </h3>
              <p className="text-slate-500 text-[10px] font-medium tracking-wide uppercase font-mono">Define storage parameters</p>
            </div>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-slate-900 transition-all"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-transparent font-sans space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 font-mono">Storage Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-3">
              {['Ambient', 'Chill', 'Frozen'].map((type) => (
                <button key={type} onClick={() => setForm({...form, type: type as StorageType})}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${form.type === type ? 'bg-slate-900 border-slate-900 text-[#D4AF37] shadow-md' : 'bg-white border-gray-200 text-slate-500 hover:border-[#D4AF37]'}`}>
                  {getTypeIcon(type as StorageType)}
                  <span className="text-xs font-bold uppercase">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#D4AF37]/20 w-full"></div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Location Code <span className="text-red-500">*</span></label>
                <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] font-mono" placeholder="e.g. WH1-Z1-A01" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Location Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Main Warehouse" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Zone</label>
                <input type="text" value={form.zone} onChange={e => setForm({...form, zone: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Z1" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Aisle</label>
                <input type="text" value={form.aisle} onChange={e => setForm({...form, aisle: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="A01" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Rack</label>
                <input type="text" value={form.rack} onChange={e => setForm({...form, rack: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="R01" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Level</label>
                <input type="text" value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="L1" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Capacity (Units)</label>
                <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Temperature (°C)</label>
                <input type="number" value={form.temperature} onChange={e => setForm({...form, temperature: Number(e.target.value)})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Full">Full</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#D4AF37]/10 bg-white flex justify-end gap-3 shrink-0 z-10 rounded-b-2xl">
          <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-900 text-xs font-bold hover:bg-gray-100 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel</button>
          <button onClick={saveLocation} className={`px-8 py-3 bg-[#403C2A] text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 uppercase tracking-widest font-mono ${(!form.code || !form.name) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#403C2A]/90'}`} disabled={!form.code || !form.name}>
            <CheckCircle size={16} /> Save Location
          </button>
        </div>
      </DraggableModal>
    </div>
  );
}
