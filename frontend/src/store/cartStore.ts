import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  basePrice: number;
  quantity: number;
  image?: string;
  configuration: {
    ram?: string;
    storage?: string;
    [key: string]: any;
  };
  specs: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateConfiguration: (id: string, configuration: CartItem['configuration']) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          // Check if item with same product and configuration exists
          const existingItem = state.items.find(
            (i) => 
              i.productId === item.productId && 
              JSON.stringify(i.configuration) === JSON.stringify(item.configuration)
          );
          
          if (existingItem) {
            // Update quantity of existing item
            return {
              items: state.items.map((i) =>
                i.id === existingItem.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          // Add new item with unique ID
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          
          return { items: [...state.items, newItem] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      updateConfiguration: (id, configuration) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id 
              ? { 
                  ...item, 
                  configuration,
                  // Recalculate price based on configuration
                  price: calculateConfiguredPrice(item.basePrice, configuration)
                } 
              : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      
      setCartOpen: (isOpen) => {
        set({ isOpen });
      },
      
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemById: (id) => {
        const state = get();
        return state.items.find((item) => item.id === id);
      },
    }),
    {
      name: 'va-pc-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);

// Helper function to calculate price with configuration
function calculateConfiguredPrice(basePrice: number, configuration: CartItem['configuration']): number {
  let price = basePrice;
  
  // RAM pricing
  if (configuration.ram === '32gb') price += 8000;
  if (configuration.ram === '64gb') price += 24000;
  
  // Storage pricing
  if (configuration.storage === '2tb') price += 7000;
  if (configuration.storage === '1tb+1tb') price += 4000;
  if (configuration.storage === '2tb+2tb') price += 12000;
  
  return price;
}