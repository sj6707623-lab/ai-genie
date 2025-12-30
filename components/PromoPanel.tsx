
import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Copy, CheckCircle } from 'lucide-react';

export const PromoPanel: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const code = "GENIE2025";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Ticket className="w-32 h-32 rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Ticket className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Exclusive Promo</span>
        </div>
        
        <h3 className="text-2xl font-black mb-2 tracking-tighter">FLAT ₹500 OFF</h3>
        <p className="text-indigo-300 text-xs font-medium mb-6">Valid on all 50+ Genie sections today only.</p>
        
        <button 
          onClick={handleCopy}
          className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-between px-4 transition-all group"
        >
          <span className="font-black tracking-widest text-sm">{code}</span>
          {copied ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
