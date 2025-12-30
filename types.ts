
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  has3D: boolean;
  description: string;
  rating?: number;
  buyUrl?: string;
  brand?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  type?: 'text' | 'image' | 'location' | 'search';
  data?: any;
}

export enum ModalType {
  SOCIAL = 'social',
  RATINGS = 'ratings',
  SETTINGS = 'settings',
  HISTORY = 'history',
  MYSTERY_OFFER = 'mystery_offer',
  SEARCH_RESULTS = 'search_results',
  PRODUCT_DETAILS = 'product_details',
  CART = 'cart'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
