'use client';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface ListenerButtonProps {
  onClick: () => void;
}

export function ListenerButton({ onClick }: ListenerButtonProps) {
  const constraintsRef = useRef(null);
  
  return (
    <motion.button
      onClick={onClick}
      drag
      dragConstraints={{ left: -150, right: 150, top: -600, bottom: 20 }}
      dragElastic={0.1}
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute bottom-[80px] lg:bottom-24 left-[calc(50%-28px)] w-14 h-14 bg-gradient-to-r from-[var(--acc)] to-[#ec4899] rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(124,58,237,0.5)] z-50 group border border-white/10 select-none touch-none"
      aria-label="Open Listener Mode"
    >
      <Mic className="relative z-10 pointer-events-none" size={26} strokeWidth={2} />
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 group-active:opacity-20 transition-opacity pointer-events-none" />
      <div className="absolute -inset-2 rounded-full border border-[var(--acc)]/30 animate-ping opacity-20 pointer-events-none" />
    </motion.button>
  );
}
