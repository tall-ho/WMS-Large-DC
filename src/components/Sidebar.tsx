import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Tags, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardList, 
  Box, 
  Truck, 
  RefreshCw, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  User,
  Activity,
  ShoppingCart,
  ShoppingBag,
  Users,
  Target,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    master: false,
    procurement: false,
    inbound: false,
    outbound: false,
    inventory: false,
    sales: false,
    reports: false
  });

  const toggleExpand = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn(
      "bg-[#1a1a1a] text-gray-300 flex flex-col border-r border-white/5 flex-shrink-0 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 z-50 w-6 h-6 bg-[#D32F2F] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#B71C1C] transition-colors border border-[#1a1a1a]"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className={cn(
        "h-20 flex items-center border-b border-white/5",
        isCollapsed ? "justify-center px-0" : "px-6"
      )}>
        <div className="flex items-center overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-900/20">
            <Box className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="ml-3 whitespace-nowrap">
              <h1 className="font-bold text-lg tracking-wide leading-none">
                <span className="text-white">WMS</span>
                <span className="text-[#FF5722]">MASTER</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">WAREHOUSE HUB</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar overflow-x-hidden">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => cn(
            "flex items-center py-2.5 rounded-lg text-sm font-medium transition-colors mb-4",
            isCollapsed ? "justify-center px-0" : "px-3",
            isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" : "hover:bg-white/5 hover:text-white"
          )}
          title={isCollapsed ? "HOME" : undefined}
        >
          <LayoutDashboard className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "HOME"}
        </NavLink>

        {/* Sales */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('sales')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Sales</span>
              {expanded.sales ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.sales || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/sales/customers" icon={<Users className="w-4 h-4" />} label="Customers" isCollapsed={isCollapsed} />
              <NavItem to="/sales/orders" icon={<FileText className="w-4 h-4" />} label="Sales Orders" isCollapsed={isCollapsed} />
              <NavItem to="/sales/my-sales" icon={<Target className="w-4 h-4" />} label="My Sales" isCollapsed={isCollapsed} />
              <NavItem to="/sales/shipments" icon={<Truck className="w-4 h-4" />} label="Shipments" isCollapsed={isCollapsed} />
              
              {/* Insights Sub-section */}
              {!isCollapsed && (
                <div className="px-3 mt-2 mb-1">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Insights</p>
                </div>
              )}
              <NavItem to="/sales/overview" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" isCollapsed={isCollapsed} />
              <NavItem to="/sales/insights/annual-report" icon={<FileText className="w-4 h-4" />} label="Annual Report" isCollapsed={isCollapsed} />
              <NavItem to="/sales/insights/category" icon={<ShoppingBag className="w-4 h-4" />} label="By Category" isCollapsed={isCollapsed} />
              <NavItem to="/sales/insights/segment" icon={<Users className="w-4 h-4" />} label="Market Segment" isCollapsed={isCollapsed} />
              <NavItem to="/sales/insights/region" icon={<MapPin className="w-4 h-4" />} label="By Region" isCollapsed={isCollapsed} />
              <NavItem to="/sales/insights/representative" icon={<User className="w-4 h-4" />} label="By Representative" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Inbound */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('inbound')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Inbound</span>
              {expanded.inbound ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.inbound || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/inbound/receiving" icon={<ArrowDownToLine className="w-4 h-4" />} label="Receiving" isCollapsed={isCollapsed} />
              <NavItem to="/inbound/putaway" icon={<Box className="w-4 h-4" />} label="Putaway" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Outbound */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('outbound')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Outbound</span>
              {expanded.outbound ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.outbound || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/outbound/picking" icon={<ClipboardList className="w-4 h-4" />} label="Picking" isCollapsed={isCollapsed} />
              <NavItem to="/outbound/packing" icon={<Box className="w-4 h-4" />} label="Packing" isCollapsed={isCollapsed} />
              <NavItem to="/outbound/shipping" icon={<Truck className="w-4 h-4" />} label="Shipping" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('inventory')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Inventory</span>
              {expanded.inventory ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.inventory || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/inventory/count" icon={<ClipboardList className="w-4 h-4" />} label="Stock Count" isCollapsed={isCollapsed} />
              <NavItem to="/inventory/transfer" icon={<RefreshCw className="w-4 h-4" />} label="Transfer" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Procurement */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('procurement')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Procurement</span>
              {expanded.procurement ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.procurement || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/procurement/suppliers" icon={<Users className="w-4 h-4" />} label="Suppliers" isCollapsed={isCollapsed} />
              <NavItem to="/procurement/purchase-requisitions" icon={<FileText className="w-4 h-4" />} label="Requisitions (PR)" isCollapsed={isCollapsed} />
              <NavItem to="/procurement/purchase-orders" icon={<ShoppingCart className="w-4 h-4" />} label="Purchase Orders" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Reports */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('reports')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Reports</span>
              {expanded.reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" />
          )}
          
          {(expanded.reports || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/reports/overview" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" isCollapsed={isCollapsed} />
              <NavItem to="/reports/balance" icon={<FileText className="w-4 h-4" />} label="Stock Balance" isCollapsed={isCollapsed} />
              <NavItem to="/reports/movement" icon={<Activity className="w-4 h-4" />} label="Movement" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        {/* Master Data */}
        <div className="mb-2">
          {!isCollapsed ? (
            <button 
              onClick={() => toggleExpand('master')}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Master Data</span>
              {expanded.master ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="h-4" /> /* Spacer */
          )}
          
          {(expanded.master || isCollapsed) && (
            <div className={cn("space-y-1", !isCollapsed && "mt-1")}>
              <NavItem to="/master/master-code" icon={<Tags className="w-4 h-4" />} label="Master Code" isCollapsed={isCollapsed} />
              <NavItem to="/master/item-master" icon={<Package className="w-4 h-4" />} label="Item Master" isCollapsed={isCollapsed} />
              <NavItem to="/master/locations" icon={<MapPin className="w-4 h-4" />} label="Locations" isCollapsed={isCollapsed} />
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <NavItem to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" isCollapsed={isCollapsed} />
        </div>
      </nav>

      {/* User Profile */}
      <div className={cn("p-4 border-t border-white/5 bg-black/20", isCollapsed && "flex flex-col items-center")}>
        <div className={cn("flex items-center mb-3", isCollapsed && "justify-center mb-0")}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full border-2 border-orange-500/30 object-cover shadow-lg shadow-orange-900/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-900/20">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-orange-400 font-medium truncate">{user?.position || user?.role || 'Role'}</p>
              {user?.email && (
                <p className="text-[10px] text-gray-500 truncate mt-0.5 font-mono">{user.email}</p>
              )}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, isCollapsed }: { to: string; icon: React.ReactNode; label: string; isCollapsed?: boolean }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center py-2.5 rounded-lg text-sm font-medium transition-colors",
        isCollapsed ? "justify-center px-0" : (isActive ? "px-3" : "px-3 ml-2"),
        isActive 
          ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
      title={isCollapsed ? label : undefined}
    >
      {icon}
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </NavLink>
  );
}
