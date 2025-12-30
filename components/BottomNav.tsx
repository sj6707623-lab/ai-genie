
import React from 'react';
import { Home, Gift, Heart, User, MoreHorizontal } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ModalType } from '../types';

const BottomNav: React.FC = () => {
  const { setActiveModal } = useApp();
  const [activeTab, setActiveTab] = React.useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', action: () => setActiveTab('home') },
    { id: 'offer', icon: Gift, label: 'Offer', action: () => { setActiveTab('offer'); setActiveModal(ModalType.MYSTERY_OFFER); } },
    { id: 'likes', icon: Heart, label: 'Likes', action: () => setActiveTab('likes') },
    { id: 'follow', icon: User, label: 'Follow', action: () => setActiveModal(ModalType.SOCIAL) },
    { id: 'more', icon: MoreHorizontal, label: 'More', action: () => setActiveModal(ModalType.SETTINGS) },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 px-2 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
              activeTab === item.id ? 'text-indigo-600 -translate-y-1' : 'text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === item.id ? 'bg-indigo-50 shadow-sm' : ''}`}>
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-indigo-600' : ''}`} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
