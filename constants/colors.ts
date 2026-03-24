// NativeWind color token → 实际颜色值 mapping（用于动态 style，不可用 className 时的兜底）
export const BG_TOKEN_MAP: Record<string, string> = {
  'orange-100': '#ffedd5',
  'blue-100': '#dbeafe',
  'green-100': '#dcfce7',
  'purple-100': '#f3e8ff',
  'yellow-100': '#fef9c3',
  'red-100': '#fee2e2',
  'indigo-100': '#e0e7ff',
  'cyan-100': '#cffafe',
  'slate-100': '#f1f5f9',
  'emerald-100': '#d1fae5',
  'amber-100': '#fef3c7',
  'sky-100': '#e0f2fe',
  'pink-100': '#fce7f3',
  'rose-100': '#ffe4e6',
  'gray-100': '#f3f4f6',
};

export const TEXT_TOKEN_MAP: Record<string, string> = {
  'text-orange-500': '#f97316',
  'text-blue-500': '#3b82f6',
  'text-green-500': '#22c55e',
  'text-purple-500': '#a855f7',
  'text-yellow-600': '#ca8a04',
  'text-red-500': '#ef4444',
  'text-indigo-500': '#6366f1',
  'text-cyan-500': '#06b6d4',
  'text-slate-500': '#64748b',
  'text-emerald-500': '#10b981',
  'text-amber-600': '#d97706',
  'text-sky-500': '#0ea5e9',
  'text-pink-500': '#ec4899',
  'text-rose-500': '#f43f5e',
  'text-gray-500': '#6b7280',
};

export const BRAND_COLOR = '#f97316'; // orange-500
export const INCOME_COLOR = '#22c55e'; // green-500
export const EXPENSE_COLOR = '#ef4444'; // red-500

// 设计系统语义色（勿硬编码，统一从此引入）
export const PRIMARY_BG_COLOR = '#fff7ed'; // orange-50, $primary_bg
export const TEXT_MAIN_COLOR = '#18181b';  // zinc-900, $text_main
export const TEXT_SECONDARY_COLOR = '#71717a'; // zinc-500, $text_secondary
export const BORDER_COLOR = '#e4e4e7';     // zinc-200, $border
export const BLUE_COLOR = '#3b82f6';       // blue-500
export const BLUE_BG_COLOR = '#dbeafe';   // blue-100
export const EMERALD_BG_COLOR = '#d1fae5'; // emerald-100
