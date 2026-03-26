import { useState, useCallback } from "react";
import dayjs from "dayjs";
import type { TransactionType } from "@/types";

interface AddFormState {
  type: TransactionType;
  /** 用户键入的原始字符串，用于 TextInput 受控值 */
  rawAmount: string;
  selectedCategoryId: string | null;
  selectedSubCategoryId: string | null;
  /** YYYY-MM-DD */
  date: string;
  note: string;
}

export interface AddFormHandlers {
  setType: (type: TransactionType) => void;
  /** 前端输入校验：仅限数字 + 单个小数点 + 最多 2 位小数 */
  setAmount: (raw: string) => void;
  /** 选中一级分类，同时清空子分类 */
  selectCategory: (catId: string) => void;
  selectSubCategory: (subId: string) => void;
  setDate: (date: string) => void;
  setNote: (note: string) => void;
  /** 切换类型后重置分类选择 */
  resetForm: () => void;
}

export type UseAddFormReturn = AddFormState &
  AddFormHandlers & {
    /** 解析后的数字金额（0 表示空 / 无效） */
    parsedAmount: number;
  };

/**
 * useAddForm — 记账表单纯状态管理 Hook
 * 只管理字段状态与前端校验，不触碰数据库或 Store。
 */
export function useAddForm(): UseAddFormReturn {
  const [state, setState] = useState<AddFormState>(() => ({
    type: "expense",
    rawAmount: "",
    selectedCategoryId: null,
    selectedSubCategoryId: null,
    date: dayjs().format("YYYY-MM-DD"),
    note: "",
  }));

  const parsedAmount = parseFloat(state.rawAmount) || 0;

  /** 切换收/支类型，同时清空已选分类 */
  const setType = useCallback((type: TransactionType) => {
    setState((s) => ({
      ...s,
      type,
      selectedCategoryId: null,
      selectedSubCategoryId: null,
    }));
  }, []);

  /** 金额输入：只接受合法的数字字符串（禁止多个小数点，最多 2 位小数） */
  const setAmount = useCallback((raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    // 禁止多个小数点
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1 && firstDot !== cleaned.lastIndexOf(".")) return;
    // 最多 2 位小数
    if (firstDot !== -1 && cleaned.length - firstDot > 3) return;
    setState((s) => ({ ...s, rawAmount: cleaned }));
  }, []);

  /** 选中一级分类，同时重置子分类 */
  const selectCategory = useCallback((catId: string) => {
    setState((s) => ({
      ...s,
      selectedCategoryId: catId,
      selectedSubCategoryId: null,
    }));
  }, []);

  const selectSubCategory = useCallback((subId: string) => {
    setState((s) => ({ ...s, selectedSubCategoryId: subId }));
  }, []);

  const setDate = useCallback((date: string) => {
    setState((s) => ({ ...s, date }));
  }, []);

  const setNote = useCallback((note: string) => {
    setState((s) => ({ ...s, note }));
  }, []);

  /** 重置表单（保留当天日期） */
  const resetForm = useCallback(() => {
    setState({
      type: "expense",
      rawAmount: "",
      selectedCategoryId: null,
      selectedSubCategoryId: null,
      date: dayjs().format("YYYY-MM-DD"),
      note: "",
    });
  }, []);

  return {
    ...state,
    parsedAmount,
    setType,
    setAmount,
    selectCategory,
    selectSubCategory,
    setDate,
    setNote,
    resetForm,
  };
}
