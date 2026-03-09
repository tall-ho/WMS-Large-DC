import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useDragControls } from 'framer-motion';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
}

export default function DraggableModal({ isOpen, onClose, children, title, width = 'max-w-4xl' }: DraggableModalProps) {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`bg-[#F9F8F4] w-full ${width} max-h-[90vh] rounded-2xl shadow-2xl border-t-[6px] border-[#D4AF37] flex flex-col overflow-hidden relative`}
        style={{ cursor: isDragging ? 'grabbing' : 'auto' }}
      >
        {/* Drag Handle / Header */}
        <div 
          onPointerDown={(e) => controls.start(e)}
          className="h-6 w-full bg-gray-100/50 absolute top-0 left-0 cursor-grab active:cursor-grabbing z-50 flex justify-center items-center group hover:bg-gray-200/50 transition-colors"
        >
          <div className="w-12 h-1 rounded-full bg-gray-300 group-hover:bg-gray-400 transition-colors" />
        </div>

        {/* Content Wrapper (with padding for handle) */}
        <div className="flex-1 flex flex-col pt-4 h-full overflow-hidden">
            {children}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
