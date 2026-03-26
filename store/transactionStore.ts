import { create } from "zustand";
import to from "await-to-js";
import dayjs from "dayjs";
import {
  insertTransaction,
  getTransactionsByDate,
  getSummaryByDateRange,
  deleteTransaction,
} from "@/db/queries";
import type { Transaction, NewTransaction } from "@/types";

interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface TransactionState {
  transactions: Transaction[];
  monthlySummary: MonthlySummary;
  error: string | null;
  isLoading: boolean;

  loadTransactionsByDate: (date: string) => Promise<void>;
  loadMonthlySummary: (year: number, month: number) => Promise<void>;
  addTransaction: (data: NewTransaction) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  monthlySummary: { totalIncome: 0, totalExpense: 0, balance: 0 },
  error: null,
  isLoading: false,

  /** 按日期加载账目列表 */
  loadTransactionsByDate: async (date: string) => {
    set({ isLoading: true });
    const [err, data] = await to(getTransactionsByDate(date));
    if (err) {
      set({ error: "加载账目失败", isLoading: false });
      return;
    }
    set({ transactions: data, isLoading: false });
  },

  /** 加载指定年月的收支汇总 */
  loadMonthlySummary: async (year: number, month: number) => {
    const start = dayjs()
      .year(year)
      .month(month - 1)
      .startOf("month")
      .format("YYYY-MM-DD");
    const end = dayjs()
      .year(year)
      .month(month - 1)
      .endOf("month")
      .format("YYYY-MM-DD");

    const [err, result] = await to(getSummaryByDateRange(start, end));
    if (err) {
      set({ error: "加载统计失败" });
      return;
    }
    const { totalIncome, totalExpense } = result;
    set({
      monthlySummary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  },

  /** 新增一笔账目，失败时向上抛出以便调用方感知 */
  addTransaction: async (data: NewTransaction) => {
    set({ isLoading: true });
    const [err] = await to(insertTransaction(data));
    if (err) {
      set({ error: "保存失败，请重试", isLoading: false });
      throw new Error("addTransaction failed");
    }
    set({ isLoading: false });
  },

  /** 删除指定账目并从列表中移除 */
  removeTransaction: async (id: string) => {
    const [err] = await to(deleteTransaction(id));
    if (err) {
      set({ error: "删除失败，请重试" });
      return;
    }
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  /** 清除错误状态 */
  clearError: () => set({ error: null }),
}));
