
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, History } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ModalType } from '../types';

const HistoryDrawer: React.FC = () => {
  const { activeModal, setActiveModal, history, clearHistory } = useApp();

  return (
    <AnimatePresence>
      {activeModal === ModalType.HISTORY && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            className="fixed top-0 left-0 h-full w-full max-w-[300px] bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <span className="font-bold">Browsing History</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-200 transition-colors">
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 italic">No history yet.</div>
              )}
            </div>
            <div className="p-4 border-t">
              <button 
                onClick={clearHistory}
                disabled={history.length === 0}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All History</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryDrawer;
