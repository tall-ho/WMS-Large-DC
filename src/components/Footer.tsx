import { Phone, Mail, User } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto pt-6 pb-6 border-t border-gray-200/50 text-center bg-[#F5F5F0]">
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        <span className="text-orange-500">✨</span>
        WMS MASTER
        <span className="text-gray-300">•</span>
        THE FUTURE OF WAREHOUSE & LOGISTICS
        <span className="text-gray-300">•</span>
        EMPOWERING SUPPLY CHAIN
      </div>
      <div className="flex items-center justify-center gap-4 text-[10px] text-orange-600/80 font-mono">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          System by T All Intelligence
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          082-5695654
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          tallintelligence.hq@gmail.com
        </span>
      </div>
    </footer>
  );
}
