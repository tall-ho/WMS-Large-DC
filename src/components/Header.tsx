import { useState, useEffect } from 'react';
import { Search, Bell, Clock, Calendar } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-[#F5F5F0] border-b border-gray-200/50">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full py-3 pl-12 pr-4 text-sm text-gray-900 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all"
          placeholder="Search items, orders, or locations..."
        />
      </div>

      {/* Right Side Widgets */}
      <div className="flex items-center space-x-4">
        {/* Date/Time Widget */}
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
          <div className="flex items-center px-4 py-2 border-r border-gray-100">
            <Calendar className="w-4 h-4 text-orange-500 mr-3" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">
                {formatDate(currentTime).split(',')[0]}
              </span>
              <span className="text-sm font-bold text-gray-800 leading-none">
                {formatDate(currentTime).split(',')[1]}
              </span>
            </div>
          </div>
          <div className="flex items-center px-4 py-2">
            <Clock className="w-4 h-4 text-purple-500 mr-3" />
            <span className="font-mono text-xl font-bold text-gray-800 tracking-tight">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Notification */}
        <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 relative transition-colors group">
          <Bell className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}
