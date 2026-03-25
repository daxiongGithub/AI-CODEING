import { create } from "zustand";
import to from "await-to-js";
import {
  getAllCategories,
  getAllCategoriesAll,
  insertCategory,
  insertSubCategory,
  toggleCategoryEnabled,
} from "@/db/queries";
import type { CategoryWithSubs, NewCategory, NewSubCategory } from "@/types";

/** 创建子分类所需的最简数据（不含 parentCategoryId） */
export type NewSubCategoryInput = Omit<NewSubCategory, "parentCategoryId">;

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
  /** 仅启用的支出分类列表 */
  expenseCategories: [],
  /** 仅启用的收入分类列表 */
  incomeCategories: [],
  /** 所有支出分类列表（含停用） */
  allExpenseCategories: [],
  /** 所有收入分类列表（含停用） */
  allIncomeCategories: [],
  /** 错误信息 */
  error: null,
  /** 加载状态 */
  isLoading: false,

  /** 加载仅启用的分类（供记账页使用） */
  loadCategories: async () => {
    set({ isLoading: true });
    const [err, results] = await to(
      Promise.all([getAllCategories("expense"), getAllCategories("income")]),
    );
    if (err) {
      set({ error: "加载分类失败", isLoading: false });
      return;
    }
    const [expense, income] = results ?? [[], []];
    set({ expenseCategories: expense, incomeCategories: income, isLoading: false });
  },

  /** 加载所有分类含停用（供分类管理页使用） */
  loadAllCategories: async () => {
    set({ isLoading: true });
    const [err, results] = await to(
      Promise.all([getAllCategoriesAll("expense"), getAllCategoriesAll("income")]),
    );
    if (err) {
      set({ error: "加载分类失败", isLoading: false });
      return;
    }
    const [expense, income] = results ?? [[], []];
    set({
      allExpenseCategories: expense,
      allIncomeCategories: income,
      isLoading: false,
    });
  },

  /** 新增一级分类，成功后刷新所有分类列表 */
  addCategory: async (data: NewCategory) => {
    const [err] = await to(insertCategory(data));
    if (err) {
      set({ error: "新增分类失败" });
      throw new Error("addCategory failed");
    }
    const [errLoad, results] = await to(
      Promise.all([
        getAllCategories("expense"),
        getAllCategories("income"),
        getAllCategoriesAll("expense"),
        getAllCategoriesAll("income"),
      ]),
    );
    if (errLoad) {
      set({ error: "新增分类失败" });
      throw errLoad;
    }
    const [expense, income, allExp, allInc] = results ?? [[], [], [], []];
    set({
      expenseCategories: expense,
      incomeCategories: income,
      allExpenseCategories: allExp,
      allIncomeCategories: allInc,
    });
  },

  /** 原子创建一级分类及子分类，全部成功后刷新状态 */
  addCategoryWithSubs: async (
    categoryData: NewCategory,
    subList: NewSubCategoryInput[],
  ) => {
    const [err, created] = await to(insertCategory(categoryData));
    if (err || !created) {
      set({ error: "新增分类失败" });
      throw new Error("addCategoryWithSubs: insertCategory failed");
    }
    if (subList.length > 0) {
      const [errSub] = await to(
        Promise.all(
          subList.map((sub) =>
            insertSubCategory({ ...sub, parentCategoryId: created.id }),
          ),
        ),
      );
      if (errSub) {
        set({ error: "新增分类失败" });
        throw errSub;
      }
    }
    const [errLoad, results] = await to(
      Promise.all([
        getAllCategories("expense"),
        getAllCategories("income"),
        getAllCategoriesAll("expense"),
        getAllCategoriesAll("income"),
      ]),
    );
    if (errLoad) {
      set({ error: "新增分类失败" });
      throw errLoad;
    }
    const [expense, income, allExp, allInc] = results ?? [[], [], [], []];
    set({
      expenseCategories: expense,
      incomeCategories: income,
      allExpenseCategories: allExp,
      allIncomeCategories: allInc,
    });
  },

  /** 新增二级分类，成功后刷新所有分类列表 */
  addSubCategory: async (parentId: string, subData: NewSubCategoryInput) => {
    const [err] = await to(
      insertSubCategory({ ...subData, parentCategoryId: parentId }),
    );
    if (err) {
      set({ error: "新增二级分类失败" });
      throw new Error("addSubCategory failed");
    }
    const [errLoad, results] = await to(
      Promise.all([
        getAllCategories("expense"),
        getAllCategories("income"),
        getAllCategoriesAll("expense"),
        getAllCategoriesAll("income"),
      ]),
    );
    if (errLoad) {
      set({ error: "新增二级分类失败" });
      throw errLoad;
    }
    const [expense, income, allExp, allInc] = results ?? [[], [], [], []];
    set({
      expenseCategories: expense,
      incomeCategories: income,
      allExpenseCategories: allExp,
      allIncomeCategories: allInc,
    });
  },

  /** 切换分类启用/停用状态，成功后刷新所有分类列表 */
  toggleEnabled: async (id: string, enabled: boolean) => {
    const [err] = await to(toggleCategoryEnabled(id, enabled));
    if (err) {
      set({ error: "操作失败" });
      return;
    }
    const [errLoad, results] = await to(
      Promise.all([
        getAllCategories("expense"),
        getAllCategories("income"),
        getAllCategoriesAll("expense"),
        getAllCategoriesAll("income"),
      ]),
    );
    if (errLoad) {
      set({ error: "操作失败" });
      return;
    }
    const [expense, income, allExp, allInc] = results ?? [[], [], [], []];
    set({
      expenseCategories: expense,
      incomeCategories: income,
      allExpenseCategories: allExp,
      allIncomeCategories: allInc,
    });
  },

  /** 清空错误状态 */
  clearError: () => set({ error: null }),
}));
