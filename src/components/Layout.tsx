import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#F5F5F0] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F5F5F0]">
          <div className="container mx-auto px-8 py-6 min-h-[calc(100vh-140px)]">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
