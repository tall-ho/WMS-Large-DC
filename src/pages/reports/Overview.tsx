import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Truck, 
  DollarSign,
  Activity,
  Map as MapIcon
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// --- Mock Data ---
const WAREHOUSE_DATA = [
  { name: 'Used', value: 34.08, fill: '#1F1E1B' },
  { name: 'Free', value: 65.92, fill: '#E5E7EB' },
];

const TRANSPORT_COST_DATA = [
  { region: 'North', accessories: 580, clothing: 580, electronics: 620, furniture: 720 },
  { region: 'West', accessories: 450, clothing: 570, electronics: 750, furniture: 670 },
  { region: 'East', accessories: 550, clothing: 590, electronics: 610, furniture: 530 },
  { region: 'South', accessories: 410, clothing: 600, electronics: 530, furniture: 540 },
];

const UNITS_SOLD_DATA = Array.from({ length: 12 }, (_, i) => ({
  date: `2025-${(i + 1).toString().padStart(2, '0')}`,
  value: 900 + Math.random() * 200
}));

const LEAD_TIME_DATA = [
  { name: 'Clothing', value: 24.25, fill: '#8C6F36' },
  { name: 'Accessories', value: 26.32, fill: '#BFBAA8' },
  { name: 'Electronics', value: 24.86, fill: '#58594D' },
  { name: 'Furniture', value: 24.57, fill: '#1F1E1B' },
];

const BACKORDER_DATA = [
  { status: 'Fulfilled', count: 838, fill: '#58594D' },
  { status: 'Pending', count: 248, fill: '#8C6F36' },
  { status: 'Canceled', count: 114, fill: '#BFBAA8' },
];

const INVENTORY_LEVEL_DATA = [
  { category: 'Accessories', east: 180, north: 190, south: 170, west: 160 },
  { category: 'Furniture', east: 210, north: 170, south: 150, west: 200 },
  { category: 'Electronics', east: 160, north: 220, south: 180, west: 150 },
  { category: 'Clothing', east: 190, north: 200, south: 210, west: 170 },
];

// Thailand Map Data (Provinces)
const THAILAND_TOPO_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/thailand/thailand-provinces.json";

const HEATMAP_DATA = [
  { name: "Bangkok", coordinates: [100.5018, 13.7563], value: 100 },
  { name: "Chiang Mai", coordinates: [98.9853, 18.7883], value: 80 },
  { name: "Phuket", coordinates: [98.3923, 7.8804], value: 60 },
  { name: "Khon Kaen", coordinates: [102.8236, 16.4322], value: 40 },
  { name: "Chon Buri", coordinates: [100.9817, 13.3611], value: 70 },
];

const colorScale = scaleLinear<string>()
  .domain([0, 100])
  .range(["#FCD34D", "#D4AF37", "#BE123C"]);

// --- Components ---
const KPICard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-[#1F1E1B] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className={`absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon size={64} />
    </div>
    <div>
      <h3 className="text-3xl font-bold font-mono">{value}</h3>
      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{title}</p>
    </div>
    {subtext && <p className="text-[10px] text-[#D4AF37] mt-2">{subtext}</p>}
  </div>
);

export default function Overview() {
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-8 py-6 bg-[#58594D] text-white flex justify-between items-center shadow-md z-10">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">Inventory and Supply Chain Analysis</h1>
          <p className="text-xs opacity-70 font-mono mt-1">REAL-TIME DASHBOARD</p>
        </div>
        <div className="bg-white/10 p-2 rounded-lg">
          <Activity size={24} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col gap-6">
          
          {/* Top Section: KPIs + Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: KPIs */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <KPICard title="Warehouse Utilization" value="34.08%" icon={Package} color="text-green-500" />
              <KPICard title="Day Sales of Inventory" value="15.56" icon={Clock} color="text-blue-500" />
              <KPICard title="Inventory Turnover" value="23.47" icon={TrendingUp} color="text-purple-500" />
              
              {/* Filters (Mock) */}
              <div className="bg-[#1F1E1B] p-4 rounded-2xl text-white mt-auto">
                <label className="text-xs text-gray-400 uppercase block mb-2">Region</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
                  <option>All Regions</option>
                  <option>North</option>
                  <option>East</option>
                  <option>West</option>
                  <option>South</option>
                </select>
                
                <label className="text-xs text-gray-400 uppercase block mt-4 mb-2">Category</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
                  <option>All Categories</option>
                  <option>Clothing</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                </select>
              </div>
            </div>

            {/* Middle & Right: Charts */}
            <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Warehouse Utilization Gauge */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Warehouse Utilization</h3>
                <div className="relative w-48 h-48">
                  <PieChart width={192} height={192}>
                    <Pie
                      data={WAREHOUSE_DATA}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {WAREHOUSE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                    <span className="text-3xl font-bold text-[#1F1E1B]">34.08</span>
                    <span className="text-xs text-gray-400">Target: 78.00</span>
                  </div>
                </div>
              </div>

              {/* Transportation Cost */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Transportation Cost by Region</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={TRANSPORT_COST_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f9f9f9'}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                    <Bar dataKey="accessories" fill="#1F1E1B" stackId="a" />
                    <Bar dataKey="clothing" fill="#58594D" stackId="a" />
                    <Bar dataKey="electronics" fill="#8C6F36" stackId="a" />
                    <Bar dataKey="furniture" fill="#BFBAA8" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Units Sold */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-3">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Sum of Units Sold by Date</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={UNITS_SOLD_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8C6F36" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8C6F36" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8C6F36" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Row 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Lead Time by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={LEAD_TIME_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {LEAD_TIME_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{fontSize: '10px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Backorder by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={BACKORDER_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f9f9f9'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {BACKORDER_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase">Inventory Level</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={INVENTORY_LEVEL_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10}} width={70} />
                    <Tooltip cursor={{fill: '#f9f9f9'}} />
                    <Legend wrapperStyle={{fontSize: '10px'}} />
                    <Bar dataKey="east" fill="#1F1E1B" stackId="a" />
                    <Bar dataKey="north" fill="#58594D" stackId="a" />
                    <Bar dataKey="south" fill="#8C6F36" stackId="a" />
                    <Bar dataKey="west" fill="#BFBAA8" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Thailand Sales Heatmap Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <MapIcon className="text-[#D4AF37]" /> Thailand Sales Heatmap
                </h2>
                <p className="text-xs text-gray-500 mt-1">Geographic distribution of sales performance</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-[#FCD34D] rounded-full"></div> Low</span>
                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div> Medium</span>
                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 bg-[#BE123C] rounded-full"></div> High</span>
              </div>
            </div>
            
            <div className="w-full h-[600px] bg-blue-50/30 rounded-xl overflow-hidden relative flex justify-center items-center border border-gray-100">
              <ComposableMap 
                projection="geoMercator" 
                projectionConfig={{
                  scale: 2800,
                  center: [100.5, 13.7] // Center on Thailand
                }}
                className="w-full h-full"
              >
                <Geographies geography={THAILAND_TOPO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#EAEAEC"
                        stroke="#D6D6DA"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#F5F5F5", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                
                {HEATMAP_DATA.map(({ name, coordinates, value }) => (
                  <Marker key={name} coordinates={coordinates as [number, number]}>
                    <circle r={10} fill={colorScale(value)} stroke="#fff" strokeWidth={2} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                    <text
                      textAnchor="middle"
                      y={-15}
                      style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px", fontWeight: "bold" }}
                    >
                      {name}
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
