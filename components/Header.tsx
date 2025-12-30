
import React, { useState } from 'react';
import { Menu, Search, User, ShoppingCart, Sparkles, Loader2, Mic } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ModalType } from '../types';
import { geminiService } from '../services/geminiService';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { setAssistantOpen, setActiveModal, cart, setSearchResults } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      const results = await geminiService.search(searchTerm);
      setSearchResults(results);
      setActiveModal(ModalType.SEARCH_RESULTS);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-indigo-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setActiveModal(ModalType.HISTORY)} className="lg:hidden p-2 text-indigo-600">
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-indigo-950 tracking-tighter hidden sm:block uppercase">AI GENIE</span>
        </div>

        <div className="flex-1 max-w-2xl relative group px-2 sm:px-0 flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tailors, Diabetes help, Gadgets..."
              className="w-full py-2.5 pl-12 pr-32 rounded-full bg-indigo-50/50 border border-transparent focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-indigo-900"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 w-5 h-5" />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAssistantOpen(true)}
                className="p-2 bg-white text-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors border border-indigo-100"
                title="Talk to Live Genie"
              >
                <div className="relative">
                  <User className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse" />
                </div>
              </motion.button>

              <button 
                disabled={isSearching}
                onClick={handleSearch}
                className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black tracking-widest rounded-full hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'AI SEARCH'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal(ModalType.SETTINGS)} 
            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hover:scale-110 active:scale-90"
            title="User Profile"
          >
            <User className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveModal(ModalType.CART)} 
            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative hover:scale-110 active:scale-90"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white font-black shadow-lg">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
