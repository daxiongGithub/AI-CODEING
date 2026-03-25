import { create } from 'zustand';
import type { CategoryWithSubs, NewCategory, NewSubCategory } from '@/types';
import {
  getAllCategories,
  getAllCategoriesAll,
  insertCategory,
  insertSubCategory,
  toggleCategoryEnabled,
} from '@/db/queries';

/** 创建子分类所需的最简数据（不含 parentCategoryId） */
export type NewSubCategoryInput = Omit<NewSubCategory, 'parentCategoryId'>;

interface CategoryState {
  /** 仅启用的分类，供记账页使用 */
  expenseCategories: CategoryWithSubs[];
  incomeCategories: CategoryWithSubs[];
  /** 所有分类（含停用），供分类管理页使用 */
  allExpenseCategories: CategoryWithSubs[];
  allIncomeCategories: CategoryWithSubs[];
  error: string | null;
  isLoading: boolean;

  loadCategories: () => Promise<void>;
  loadAllCategories: () => Promise<void>;
  addCategory: (data: NewCategory) => Promise<void>;
  /** 原子创建一级分类 + 若干子分类，全部成功后刷新状态 */
  addCategoryWithSubs: (
    categoryData: NewCategory,
    subList: NewSubCategoryInput[],
  ) => Promise<void>;
  addSubCategory: (parentId: string, subData: NewSubCategoryInput) => Promise<void>;
  toggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  expenseCategories: [],
  incomeCategories: [],
  allExpenseCategories: [],
  allIncomeCategories: [],
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

  loadAllCategories: async () => {
    try {
      set({ isLoading: true });
      const [expense, income] = await Promise.all([
        getAllCategoriesAll('expense'),
        getAllCategoriesAll('income'),
      ]);
      set({
        allExpenseCategories: expense,
        allIncomeCategories: income,
        isLoading: false,
      });
    } catch {
      set({ error: '加载分类失败', isLoading: false });
    }
  },

  addCategory: async (data: NewCategory) => {
    try {
      await insertCategory(data);
      const [expense, income, allExp, allInc] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
        getAllCategoriesAll('expense'),
        getAllCategoriesAll('income'),
      ]);
      set({
        expenseCategories: expense,
        incomeCategories: income,
        allExpenseCategories: allExp,
        allIncomeCategories: allInc,
      });
    } catch {
      set({ error: '新增分类失败' });
      throw new Error('addCategory failed');
    }
  },

  addCategoryWithSubs: async (
    categoryData: NewCategory,
    subList: NewSubCategoryInput[],
  ) => {
    try {
      const created = await insertCategory(categoryData);
      if (subList.length > 0) {
        await Promise.all(
          subList.map((sub) =>
            insertSubCategory({ ...sub, parentCategoryId: created.id }),
          ),
        );
      }
      const [expense, income, allExp, allInc] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
        getAllCategoriesAll('expense'),
        getAllCategoriesAll('income'),
      ]);
      set({
        expenseCategories: expense,
        incomeCategories: income,
        allExpenseCategories: allExp,
        allIncomeCategories: allInc,
      });
    } catch {
      set({ error: '新增分类失败' });
      throw new Error('addCategoryWithSubs failed');
    }
  },

  addSubCategory: async (parentId: string, subData: NewSubCategoryInput) => {
    try {
      await insertSubCategory({ ...subData, parentCategoryId: parentId });
      const [expense, income, allExp, allInc] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
        getAllCategoriesAll('expense'),
        getAllCategoriesAll('income'),
      ]);
      set({
        expenseCategories: expense,
        incomeCategories: income,
        allExpenseCategories: allExp,
        allIncomeCategories: allInc,
      });
    } catch {
      set({ error: '新增二级分类失败' });
      throw new Error('addSubCategory failed');
    }
  },

  toggleEnabled: async (id: string, enabled: boolean) => {
    try {
      await toggleCategoryEnabled(id, enabled);
      const [expense, income, allExp, allInc] = await Promise.all([
        getAllCategories('expense'),
        getAllCategories('income'),
        getAllCategoriesAll('expense'),
        getAllCategoriesAll('income'),
      ]);
      set({
        expenseCategories: expense,
        incomeCategories: income,
        allExpenseCategories: allExp,
        allIncomeCategories: allInc,
      });
    } catch {
      set({ error: '操作失败' });
    }
  },

  clearError: () => set({ error: null }),
}));
