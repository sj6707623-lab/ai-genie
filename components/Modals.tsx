
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Twitter, Instagram, Linkedin, Star, Globe, ExternalLink, Search, ShoppingBag, Trash2, ShieldCheck, CreditCard, Settings as SettingsIcon, LogOut, Heart, Package, ChevronRight, ShoppingCart, Sparkles, Zap, Copy } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ModalType } from '../types';

const ModalWrapper: React.FC<{ children: React.ReactNode, title: string, onClose: () => void, maxWidth?: string }> = ({ children, title, onClose, maxWidth = "max-w-2xl" }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, y: 30 }} 
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 30 }}
      className={`bg-white rounded-[3rem] w-full ${maxWidth} overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/20`}
    >
      <div className="flex justify-between items-center p-8 border-b bg-indigo-50/30">
        <h3 className="text-2xl font-black text-indigo-950 flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <Search className="w-6 h-6" />
          </div>
          {title}
        </h3>
        <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-[1.5rem] transition-all shadow-sm bg-white border border-slate-100">
          <X className="w-6 h-6 text-indigo-400" />
        </button>
      </div>
      <div className="p-10 max-h-[85vh] overflow-y-auto no-scrollbar">
        {children}
      </div>
    </motion.div>
  </div>
);

export const Modals: React.FC = () => {
  const { activeModal, setActiveModal, searchResults, selectedProduct, cart, removeFromCart, addToCart, user } = useApp();

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      {/* Product Details Modal */}
      {activeModal === ModalType.PRODUCT_DETAILS && selectedProduct && (
        <ModalWrapper title="Product Experience" onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-inner border border-slate-200">
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 cursor-pointer hover:border-indigo-400 transition-colors">
                    <img src={selectedProduct.image} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{selectedProduct.category}</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-black text-indigo-950">{selectedProduct.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <h2 className="text-5xl font-black text-indigo-950 tracking-tighter mb-4 leading-tight">{selectedProduct.name}</h2>
                <div className="text-indigo-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  Brand: <span className="text-indigo-950">{selectedProduct.brand}</span>
                </div>
              </div>
              
              <div className="text-5xl font-black text-indigo-600 mb-8 flex items-baseline gap-2">
                ₹{selectedProduct.price.toLocaleString()}
                <span className="text-lg text-slate-400 line-through font-bold">₹{(selectedProduct.price + 500).toLocaleString()}</span>
              </div>
              
              <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 mb-10">
                <p className="text-indigo-900/80 leading-relaxed font-medium text-lg">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                 <button 
                  onClick={() => { addToCart(selectedProduct); setActiveModal(ModalType.CART); }}
                  className="py-6 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[2rem] font-black shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                   <ShoppingBag className="w-6 h-6" /> ADD TO BAG
                 </button>
                 <a 
                  href={selectedProduct.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                 >
                   <ExternalLink className="w-6 h-6" /> BUY NOW
                 </a>
              </div>
              
              <div className="flex items-center justify-center gap-10 mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400" /> Verified Quality</div>
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Free Shipping</div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Cart Modal */}
      {activeModal === ModalType.CART && (
        <ModalWrapper title="Genie Bag" onClose={() => setActiveModal(null)} maxWidth="max-w-md">
          <div className="space-y-8">
            {cart.length > 0 ? (
              <>
                <div className="space-y-6 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-black text-indigo-950 text-base truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-indigo-400 mb-3">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-indigo-600">₹{item.price.toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.id)} className="p-3 text-red-400 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 bg-indigo-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[50px] -mr-10 -mt-10" />
                  <div className="flex justify-between mb-3 opacity-60 text-xs font-black uppercase tracking-[0.2em]">
                    <span>Cart Subtotal</span>
                    <span>₹{cart.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-8 font-black text-3xl tracking-tighter">
                    <span>Grand Total</span>
                    <span>₹{cart.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}</span>
                  </div>
                  <button className="w-full py-5 bg-white text-indigo-950 rounded-[1.5rem] font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl">
                    <CreditCard className="w-6 h-6" /> PAY SECURELY
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShoppingCart className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Your Genie Bag is Empty</p>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="mt-6 px-10 py-3 bg-indigo-600 text-white rounded-full font-black text-xs hover:bg-indigo-700 transition-all"
                >
                  START SHOPPING
                </button>
              </div>
            )}
          </div>
        </ModalWrapper>
      )}

      {/* Account Dashboard */}
      {activeModal === ModalType.SETTINGS && (
        <ModalWrapper title="Genie Control Center" onClose={() => setActiveModal(null)}>
          <div className="space-y-10">
            <div className="flex items-center gap-8 p-10 bg-gradient-to-br from-indigo-50 to-white rounded-[3rem] border border-indigo-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Sparkles className="w-40 h-40" />
               </div>
               <div className="relative">
                 <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=geniemaster" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
               </div>
               <div className="relative">
                  <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">{user?.name}</h3>
                  <p className="text-indigo-400 font-bold text-base mb-4">{user?.email}</p>
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-200">
                    👑 ELITE GENIE MEMBER
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Orders', icon: Package, value: '28' },
                { label: 'Wishlist', icon: Heart, value: '156' },
                { label: 'Points', icon: Zap, value: '4.5k' },
                { label: 'Reviews', icon: Star, value: '12' },
              ].map(stat => (
                <div key={stat.label} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                   <div className="p-3 bg-white rounded-2xl mb-3 shadow-sm">
                     <stat.icon className="w-6 h-6 text-indigo-400" />
                   </div>
                   <div className="text-2xl font-black text-indigo-950 tracking-tighter">{stat.value}</div>
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[
                { label: 'Manage Payment Methods', icon: CreditCard },
                { label: 'Delivery Addresses', icon: Globe },
                { label: 'Security & Privacy', icon: ShieldCheck },
                { label: 'Sign Out Account', icon: LogOut, color: 'text-red-500 bg-red-50 border-red-100 hover:bg-red-100' },
              ].map(item => (
                <button key={item.label} className={`w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-all group ${item.color || 'text-indigo-950'}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                      <item.icon className="w-6 h-6 opacity-60" />
                    </div>
                    <span className="font-black text-lg tracking-tight">{item.label}</span>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Mystery Offer Modal */}
      {activeModal === ModalType.MYSTERY_OFFER && (
        <ModalWrapper title="Genie Mystery" onClose={() => setActiveModal(null)} maxWidth="max-w-md">
          <div className="text-center py-10 space-y-8">
            <div className="relative inline-block">
              <Sparkles className="w-20 h-20 text-indigo-600 animate-pulse mx-auto" />
              <div className="absolute inset-0 bg-indigo-400/20 blur-2xl animate-ping rounded-full" />
            </div>
            
            <div>
              <h3 className="text-4xl font-black text-indigo-950 tracking-tighter mb-2">YOU GOT IT!</h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">A special gift just for you</p>
            </div>
            
            <div className="p-10 bg-indigo-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/40 to-transparent pointer-events-none" />
               <div className="relative z-10">
                  <div className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">PROMO CODE</div>
                  <div className="text-5xl font-black tracking-tighter mb-8 group-hover:scale-110 transition-transform">MAGIC99</div>
                  <button className="w-full py-4 bg-white text-indigo-950 rounded-[1.5rem] font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                    <Copy className="w-5 h-5" /> COPY CODE
                  </button>
               </div>
            </div>
            
            <p className="text-slate-400 text-[10px] font-bold italic">Valid for the next 2 hours on all Genie sections.</p>
          </div>
        </ModalWrapper>
      )}

      {/* Search Results Modal */}
      {activeModal === ModalType.SEARCH_RESULTS && searchResults && (
        <ModalWrapper title="Genie AI Intelligence" onClose={() => setActiveModal(null)} maxWidth="max-w-3xl">
          <div className="space-y-10">
            <div className="prose prose-indigo max-w-none text-indigo-950 text-xl leading-relaxed font-medium bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
              {searchResults.text}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-6 h-1 bg-indigo-600 rounded-full" /> VERIFIED WEB SOURCES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-white rounded-[2rem] hover:bg-indigo-50 transition-all group border border-indigo-100 hover:border-indigo-200 shadow-sm"
                  >
                    <span className="text-base font-black text-indigo-950 truncate mr-4">{link.title}</span>
                    <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
};
