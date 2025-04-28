import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';

interface CartState {
  items: Record<string, CartItem[]>;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      total: 0,

      addItem: (product) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          toast.error('Please sign in to add items to cart');
          return;
        }

        set((state) => {
          const userCart = state.items[userId] || [];
          const existingItem = userCart.find((item) => item.id === product.id);

          if (existingItem) {
            if (existingItem.quantity < product.stock) {
              const updatedUserCart = userCart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
              return {
                items: {
                  ...state.items,
                  [userId]: updatedUserCart,
                },
              };
            } else {
              toast.error('No more stock available');
              return state;
            }
          } else {
            return {
              items: {
                ...state.items,
                [userId]: [...userCart, { ...product, quantity: 1 }],
              },
            };
          }
        });
        toast.success('Item added to cart');
      },

      removeItem: (productId) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        set((state) => ({
          items: {
            ...state.items,
            [userId]: (state.items[userId] || []).filter(
              (item) => item.id !== productId
            ),
          },
        }));
        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        set((state) => ({
          items: {
            ...state.items,
            [userId]: (state.items[userId] || []).map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          },
        }));
      },

      clearCart: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        set((state) => ({
          items: {
            ...state.items,
            [userId]: [],
          },
        }));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);