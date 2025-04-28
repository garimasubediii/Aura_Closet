import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import toast from 'react-hot-toast';

interface ProductState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  selectedCategory: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  selectedCategory: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      let query = supabase.from('products').select('*');
      
      if (get().selectedCategory) {
        query = query.eq('category_id', get().selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ products: data });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ categories: data });
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  addProduct: async (product) => {
    try {
      const { error } = await supabase.from('products').insert([product]);
      if (error) throw error;
      
      toast.success('Product added successfully');
      get().fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Product updated successfully');
      get().fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Product deleted successfully');
      get().fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    get().fetchProducts();
  },
}));