
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AssistantPanel from './components/AssistantPanel';
import { Modals } from './components/Modals';
import HistoryDrawer from './components/HistoryDrawer';
import { ModalType, Product } from './types';
import { MOCK_PRODUCTS, CATEGORIES } from './mockData';
import { Ai3DButton } from './components/Ai3DButton';
import { PromoPanel } from './components/PromoPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Package, ChevronRight, Zap, Heart, Sparkles, Plus, Clock, Stethoscope, Scissors, ShoppingCart, Store, ArrowRight, LayoutGrid, Search } from 'lucide-react';

const MainContent: React.FC = () => {
  const { setActiveModal, visitorCount, addToHistory, setSelectedProduct, addToCart, setAssistantOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredProducts = activeCategory === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  const displayedProducts = filteredProducts.slice(0, page * itemsPerPage);

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setActiveModal(ModalType.PRODUCT_DETAILS);
    addToHistory(p.category);
  };

  const handleLoadMore = () => setPage(prev => prev + 1);

  const FEATURED_SHOPS = [
    { name: 'Tailoring', icon: Scissors, color: 'bg-blue-600', desc: 'Custom stitching' },
    { name: 'Diabetes Care', icon: Stethoscope, color: 'bg-red-500', desc: 'Health essentials' },
    { name: 'Electronics', icon: Zap, color: 'bg-amber-500', desc: 'Latest gadgets' },
    { name: 'Luxury', icon: Sparkles, color: 'bg-indigo-700', desc: 'Premium lifestyle' },
  ];

  return (
    <main className="container mx-auto px-4 py-8 pb-32">
      {/* 3-Column Premium Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        <div className="md:col-span-3 space-y-6">
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setActiveModal(ModalType.MYSTERY_OFFER)}
            className="bg-indigo-950 rounded-[2.5rem] p-8 text-white flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-2xl h-[200px]"
          >
            <div className="z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black mb-1 tracking-tighter">Genie Mystery</h3>
              <p className="text-indigo-300 text-[10px] font-medium uppercase tracking-widest">Tap to Reveal</p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-[100px]" />
          </motion.div>
          
          <PromoPanel />
        </div>

        {/* REPLACED STATIC BANNER WITH AI GENIE SHOP SELECTOR */}
        <div className="md:col-span-6 bg-white rounded-[3rem] relative overflow-hidden group shadow-2xl min-h-[450px] border border-indigo-100 flex flex-col">
          <div className="p-10 flex-1">
             <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                  <Store className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-4xl font-black text-indigo-950 tracking-tighter leading-none">AI GENIE SHOP</h2>
                 <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Intelligent Department Selector</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                {FEATURED_SHOPS.map((shop) => (
                  <motion.div 
                    key={shop.name}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveCategory(shop.name); setPage(1); }}
                    className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 cursor-pointer group/tile hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all"
                  >
                    <div className={`w-12 h-12 ${shop.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover/tile:rotate-12 transition-transform`}>
                      <shop.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-indigo-950 text-lg tracking-tight">{shop.name}</h4>
                    <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">{shop.desc}</p>
                  </motion.div>
                ))}
             </div>

             <div className="flex items-center gap-4 p-6 bg-indigo-950 rounded-[2rem] text-white group cursor-pointer" onClick={() => setAssistantOpen(true)}>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Genie Voice Command</p>
                  <p className="font-bold text-sm">"Open Electronics Shop..."</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </div>
          </div>
          
          <div className="bg-indigo-50/50 p-6 flex items-center justify-between border-t border-indigo-100">
             <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/50?u=${i}`} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">Active Genie Shoppers</span>
             </div>
             <button 
              onClick={() => setActiveCategory('All')}
              className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2"
             >
               <LayoutGrid className="w-3.5 h-3.5" /> View All Shops
             </button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-indigo-100 flex flex-col items-center justify-center text-center shadow-xl h-[220px]">
            <div className="relative mb-6">
              <Zap className="w-10 h-10 text-indigo-600 fill-indigo-600 animate-pulse relative z-10" />
              <div className="absolute inset-0 bg-indigo-400/20 blur-xl animate-ping" />
            </div>
            <div className="text-5xl font-black text-indigo-950 mb-1 tracking-tighter">{visitorCount.toLocaleString()}</div>
            <p className="text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">Live Genie Users</p>
          </div>
          
          <div className="bg-indigo-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center h-[210px] border border-indigo-100">
            <Package className="w-8 h-8 text-indigo-400 mb-4" />
            <div className="text-2xl font-black text-indigo-950">50 SECTIONS</div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Fully Stocked</p>
          </div>
        </div>
      </section>

      {/* Hero Categories Slider */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-indigo-950 uppercase tracking-[0.3em] flex items-center gap-3">
             <div className="w-8 h-1 bg-indigo-600 rounded-full" /> SELECT A GENIE SECTION
          </h3>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{CATEGORIES.length} Categories Total</span>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-6 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); addToHistory(cat); }}
              className={`px-10 py-4 rounded-2xl font-black whitespace-nowrap transition-all flex items-center gap-3 shadow-md border ${
                activeCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200 scale-105' 
                : 'bg-white text-indigo-400 border-indigo-50 hover:border-indigo-200 hover:shadow-lg'
              }`}
            >
              {cat === 'Tailoring' && <Scissors className="w-5 h-5" />}
              {cat === 'Diabetes Care' && <Stethoscope className="w-5 h-5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx % 10 * 0.05 }}
              onClick={() => openProduct(product)}
              className="bg-white rounded-[2.5rem] p-6 group border border-indigo-50 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:border-indigo-200 transition-all duration-500 relative flex flex-col h-full cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 mb-6 shadow-inner border border-slate-100">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" 
                  alt={product.name} 
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://loremflickr.com/800/1000/product?lock=${idx}`;
                  }}
                />
                <div className="absolute inset-0 bg-indigo-950/0 group-hover:bg-indigo-950/10 transition-colors duration-500" />
                
                {product.has3D && (
                  <div className="absolute top-4 right-4 z-10">
                    <Ai3DButton onClick={() => {}} />
                  </div>
                )}
                
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="absolute bottom-4 right-4 p-4 bg-white text-indigo-600 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-indigo-600 hover:text-white"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{product.brand}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-indigo-950">{product.rating?.toFixed(1)}</span>
                  </div>
                </div>
                
                <h4 className="font-black text-indigo-950 text-base leading-tight line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">{product.name}</h4>

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</span>
                    <p className="text-2xl font-black text-indigo-600 leading-none">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length > displayedProducts.length && (
        <div className="mt-20 flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="px-12 py-5 bg-indigo-950 text-white rounded-[2rem] font-black hover:bg-indigo-800 transition-all shadow-xl flex items-center gap-4 group"
          >
            LOAD MORE ITEMS
            <div className="p-1 bg-white/20 rounded-full group-hover:rotate-180 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <Header />
        <MainContent />
        <BottomNav />
        <AssistantPanel />
        <HistoryDrawer />
        <Modals />
      </div>
    </AppProvider>
  );
};

export default App;
