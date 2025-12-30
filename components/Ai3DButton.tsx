
import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

interface Props {
  onClick: () => void;
  label?: string;
}

export const Ai3DButton: React.FC<Props> = ({ onClick, label = "OPEN 3D VIEW" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative overflow-hidden group px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-200"
    >
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <Box className="w-4 h-4 text-white animate-bounce" />
      <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
    </motion.button>
  );
};
