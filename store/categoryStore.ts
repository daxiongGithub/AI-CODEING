import { create } from 'zustand';
import type { CategoryWithSubs, NewCategory } from '@/types';
import {
  getAllCategories,
  insertCategory,
  toggleCategoryEnabled,
} from '@/db/queries';

interface CategoryState {
  expenseCategories: CategoryWithSubs[];
  incomeCategories: CategoryWithSubs[];
  error: string | null;
  isLoading: boolean;

  loadCategories: () => Promise<void>;
  addCategory: (data: NewCategory) => Promise<void>;
  toggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  expenseCategories: [],
  incomeCategories: [],
  error: null,
  isLoading: false,

  loadCategories: async () => {
    try {
      set({ isLoading: true });
      const [expense, income] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
      ]);
      set({ expenseCategories: expense, incomeCategories: income, isLoading: false });
    } catch {
      set({ error: '加载分类失败', isLoading: false });
    }
  },

  addCategory: async (data: NewCategory) => {
    try {
      await insertCategory(data);
      const [expense, income] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
      ]);
      set({ expenseCategories: expense, incomeCategories: income });
    } catch {
      set({ error: '新增分类失败' });
      throw new Error('addCategory failed');
    }
  },

  toggleEnabled: async (id: string, enabled: boolean) => {
    try {
      await toggleCategoryEnabled(id, enabled);
      const [expense, income] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
      ]);
      set({ expenseCategories: expense, incomeCategories: income });
    } catch {
      set({ error: '操作失败' });
    }
  },

  clearError: () => set({ error: null }),
}));
