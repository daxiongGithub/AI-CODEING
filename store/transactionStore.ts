import { create } from "zustand";
import dayjs from "dayjs";
import type { Transaction, NewTransaction } from "@/types";
import {
  insertTransaction,
  getTransactionsByDate,
  getSummaryByDateRange,
  deleteTransaction,
} from "@/db/queries";

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

  loadTransactionsByDate: async (date: string) => {
    try {
      set({ isLoading: true });
      const data = await getTransactionsByDate(date);
      set({ transactions: data, isLoading: false });
    } catch {
      set({ error: "加载账目失败", isLoading: false });
    }
  },

  loadMonthlySummary: async (year: number, month: number) => {
    try {
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
      const { totalIncome, totalExpense } = await getSummaryByDateRange(start, end);
      set({
        monthlySummary: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        },
      });
    } catch {
      set({ error: "加载统计失败" });
    }
  },

  addTransaction: async (data: NewTransaction) => {
    try {
      set({ isLoading: true });
      await insertTransaction(data);
      set({ isLoading: false });
    } catch {
      set({ error: "保存失败，请重试", isLoading: false });
      throw new Error("addTransaction failed");
    }
  },

  removeTransaction: async (id: string) => {
    try {
      await deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch {
      set({ error: "删除失败，请重试" });
    }
  },

  clearError: () => set({ error: null }),
}));
