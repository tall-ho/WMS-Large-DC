import React from 'react';

interface PagePlaceholderProps {
  title: string;
}

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md">
        This module is currently under development. Please check back later for updates.
      </p>
    </div>
  );
}
