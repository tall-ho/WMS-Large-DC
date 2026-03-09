import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Master Data
import Products from './pages/master/Products';
import Locations from './pages/master/Locations';
import CodeMaster from './pages/master/CodeMaster';

import MasterCodePage from './pages/master/MasterCode';
import ItemMasterPage from './pages/master/ItemMaster';
import LocationsPage from './pages/master/Locations';
import SupplierDatabase from './pages/procurement/SupplierDatabase';
import PurchaseOrder from './pages/procurement/PurchaseOrder';
import PurchaseRequisition from './pages/procurement/PurchaseRequisition';

// Inbound
import Receiving from './pages/inbound/Receiving';
import Putaway from './pages/inbound/Putaway';

// Outbound
import Picking from './pages/outbound/Picking';
import Packing from './pages/outbound/Packing';
import Shipping from './pages/outbound/Shipping';

// Inventory
import StockCount from './pages/inventory/StockCount';
import Transfer from './pages/inventory/Transfer';

// Reports
import StockBalance from './pages/reports/StockBalance';
import Movement from './pages/reports/Movement';
import Overview from './pages/reports/Overview';

// Sales
import SalesOrders from './pages/sales/SalesOrders';
import BusinessInsights from './pages/sales/BusinessInsights';
import SalesByCategory from './pages/sales/insights/SalesByCategory';
import MarketSegmentAnalysis from './pages/sales/insights/MarketSegmentAnalysis';
import SalesByRegion from './pages/sales/insights/SalesByRegion';
import SalesByRepresentative from './pages/sales/insights/SalesByRepresentative';
import MySales from './pages/sales/MySales';
import AnnualSalesReport from './pages/sales/insights/AnnualSalesReport';
import SalesOverview from './pages/sales/SalesOverview';
import Customers from './pages/sales/Customers';
import Shipments from './pages/sales/Shipments';
import UnderConstruction from './pages/UnderConstruction';

// Settings
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/setup" element={<Setup />} /> */}
          <Route path="/setup" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="master/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="master/locations" element={<ProtectedRoute><LocationsPage /></ProtectedRoute>} />
            <Route path="master/code-master" element={<ProtectedRoute><CodeMaster /></ProtectedRoute>} />
            <Route path="master/master-code" element={<ProtectedRoute><MasterCodePage /></ProtectedRoute>} />
            <Route path="master/item-master" element={<ProtectedRoute><ItemMasterPage /></ProtectedRoute>} />
            
            <Route path="inbound/receiving" element={<ProtectedRoute><Receiving /></ProtectedRoute>} />
            <Route path="inbound/putaway" element={<ProtectedRoute><Putaway /></ProtectedRoute>} />
            
            <Route path="outbound/picking" element={<ProtectedRoute><Picking /></ProtectedRoute>} />
            <Route path="outbound/packing" element={<ProtectedRoute><Packing /></ProtectedRoute>} />
            <Route path="outbound/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            
            <Route path="inventory/count" element={<ProtectedRoute><StockCount /></ProtectedRoute>} />
            <Route path="inventory/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
            
            <Route path="reports/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
            <Route path="reports/balance" element={<ProtectedRoute><StockBalance /></ProtectedRoute>} />
            <Route path="reports/movement" element={<ProtectedRoute><Movement /></ProtectedRoute>} />
            
            <Route path="sales/overview" element={<ProtectedRoute><SalesOverview /></ProtectedRoute>} />
            <Route path="sales/orders" element={<ProtectedRoute><SalesOrders /></ProtectedRoute>} />
            <Route path="sales/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="sales/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
            <Route path="sales/my-sales" element={<ProtectedRoute><MySales /></ProtectedRoute>} />
            <Route path="sales/insights" element={<ProtectedRoute><BusinessInsights /></ProtectedRoute>} />
            <Route path="sales/insights/category" element={<ProtectedRoute><SalesByCategory /></ProtectedRoute>} />
            <Route path="sales/insights/segment" element={<ProtectedRoute><MarketSegmentAnalysis /></ProtectedRoute>} />
            <Route path="sales/insights/region" element={<ProtectedRoute><SalesByRegion /></ProtectedRoute>} />
            <Route path="sales/insights/representative" element={<ProtectedRoute><SalesByRepresentative /></ProtectedRoute>} />
            <Route path="sales/insights/annual-report" element={<ProtectedRoute><AnnualSalesReport /></ProtectedRoute>} />
            
            <Route path="procurement/suppliers" element={<ProtectedRoute><SupplierDatabase /></ProtectedRoute>} />
            <Route path="procurement/purchase-orders" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
            <Route path="procurement/purchase-requisitions" element={<ProtectedRoute><PurchaseRequisition /></ProtectedRoute>} />
            
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
