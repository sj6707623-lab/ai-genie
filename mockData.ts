
import { Product } from './types';

const CATEGORY_NAMES = [
  'Tailoring', 'Diabetes Care', 'Electronics', 'Men\'s Fashion', 'Ladies\' Fashion',
  'Kids & Baby', 'Beauty', 'Pet Care', 'Yoga', 'Fitness', 'Organic Food', 'Groceries',
  'Sports', 'Outdoor', 'Travel', 'Automotive', 'Smart Home', 'Gaming', 'Footwear',
  'Watches', 'Jewelry', 'Home Decor', 'Kitchen', 'Books', 'Stationery', 'Gardening',
  'Musical Instruments', 'Art Supplies', 'Office Wear', 'Luxury', 'Collectibles',
  'Health Supplements', 'Eyewear', 'Handbags', 'Perfumes', 'Furniture', 'Bedding',
  'Bath & Body', 'Tech Accessories', 'Photography', 'Audio', 'Appliances', 'Tools',
  'Safety Gear', 'Cycling', 'Fishing', 'Camping', 'Winter Wear', 'Summer Wear', 'Party Supplies'
];

/**
 * Generates a reliable image URL based on keywords.
 * Using loremflickr as it handles keyword-based redirection better than raw Unsplash IDs for mock data.
 */
const getProductImageUrl = (category: string, index: number) => {
  const keyword = category.toLowerCase().replace("'", "").replace("&", "and").split(' ')[0];
  // 800x1000 for a premium portrait aspect ratio
  return `https://loremflickr.com/800/1000/${encodeURIComponent(keyword)}?lock=${index + 100}`;
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  CATEGORY_NAMES.forEach((cat, catIdx) => {
    // Generate 30 products per category for a total of 1500
    for (let i = 1; i <= 30; i++) {
      const id = `${catIdx}-${i}`;
      const price = Math.floor(Math.random() * 5000) + 499; // Price in INR
      
      products.push({
        id,
        name: `${cat} Premium Item ${i}`,
        price,
        category: cat,
        has3D: Math.random() > 0.7,
        image: getProductImageUrl(cat, i),
        description: `Experience the best of ${cat} with our premium Item ${i}. Curated specifically for quality, durability, and world-class style by the AI Genie team. Perfect for modern lifestyles in India and beyond.`,
        rating: 4 + Math.random(),
        buyUrl: 'https://www.amazon.in/s?k=' + encodeURIComponent(`${cat} ${i}`),
        brand: catIdx % 2 === 0 ? 'Genie Original' : 'Premium Select'
      });
    }
  });
  
  return products;
};

export const MOCK_PRODUCTS = generateProducts();
export const CATEGORIES = ['All', ...CATEGORY_NAMES];
