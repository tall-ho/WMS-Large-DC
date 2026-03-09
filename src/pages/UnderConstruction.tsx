import { Construction } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
      <div className="bg-orange-50 p-6 rounded-full mb-6">
        <Construction className="w-16 h-16 text-orange-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2 font-mono uppercase tracking-tight">
        Under Construction
      </h1>
      <p className="text-gray-500 max-w-md mx-auto">
        We're working hard to bring you this feature. Please check back soon for updates.
      </p>
    </div>
  );
}
