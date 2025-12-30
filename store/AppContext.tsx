
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ChatMessage, ModalType } from '../types';

interface AppContextType {
  user: any | null;
  setUser: (user: any) => void;
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  activeModal: ModalType | null;
  setActiveModal: (type: ModalType | null) => void;
  history: string[];
  addToHistory: (category: string) => void;
  clearHistory: () => void;
  visitorCount: number;
  searchResults: { text: string; links: any[] } | null;
  setSearchResults: (res: { text: string; links: any[] } | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>({ name: 'Genie Master', email: 'master@aigenie.shop', credits: 5000 });
  const [cart, setCart] = useState<Product[]>([]);
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [history, setHistory] = useState<string[]>(['Tailoring', 'Diabetes Health', 'Electronics']);
  const [visitorCount, setVisitorCount] = useState(10542);
  const [searchResults, setSearchResults] = useState<{ text: string; links: any[] } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, id: `${product.id}-${Date.now()}` }]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  
  const addToHistory = (category: string) => {
    if (!history.includes(category)) {
      setHistory([category, ...history].slice(0, 15));
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <AppContext.Provider value={{
      user, setUser, cart, addToCart, removeFromCart,
      isAssistantOpen, setAssistantOpen,
      activeModal, setActiveModal,
      history, addToHistory, clearHistory,
      visitorCount,
      searchResults, setSearchResults,
      selectedProduct, setSelectedProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
