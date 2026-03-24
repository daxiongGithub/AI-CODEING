import { db } from './client';
import { categories } from './schema';
import type { NewCategory } from '@/types';

type PresetCategory = Omit<NewCategory, 'createdAt' | 'updatedAt'>;

const PRESET_EXPENSE: PresetCategory[] = [
  { id: 'preset-exp-01', type: 'expense', name: '餐饮',     icon: 'utensils',        colorTokenBg: 'orange-100',  colorTokenText: 'text-orange-500',  sortOrder: 1,  enabled: true, isPreset: true },
  { id: 'preset-exp-02', type: 'expense', name: '购物',     icon: 'shopping-bag',    colorTokenBg: 'blue-100',    colorTokenText: 'text-blue-500',    sortOrder: 2,  enabled: true, isPreset: true },
  { id: 'preset-exp-03', type: 'expense', name: '交通',     icon: 'bus',             colorTokenBg: 'green-100',   colorTokenText: 'text-green-500',   sortOrder: 3,  enabled: true, isPreset: true },
  { id: 'preset-exp-04', type: 'expense', name: '娱乐',     icon: 'gamepad-2',       colorTokenBg: 'purple-100',  colorTokenText: 'text-purple-500',  sortOrder: 4,  enabled: true, isPreset: true },
  { id: 'preset-exp-05', type: 'expense', name: '居住',     icon: 'home',            colorTokenBg: 'yellow-100',  colorTokenText: 'text-yellow-600',  sortOrder: 5,  enabled: true, isPreset: true },
  { id: 'preset-exp-06', type: 'expense', name: '医疗',     icon: 'heart-pulse',     colorTokenBg: 'red-100',     colorTokenText: 'text-red-500',     sortOrder: 6,  enabled: true, isPreset: true },
  { id: 'preset-exp-07', type: 'expense', name: '教育',     icon: 'graduation-cap',  colorTokenBg: 'indigo-100',  colorTokenText: 'text-indigo-500',  sortOrder: 7,  enabled: true, isPreset: true },
  { id: 'preset-exp-08', type: 'expense', name: '旅行',     icon: 'plane',           colorTokenBg: 'cyan-100',    colorTokenText: 'text-cyan-500',    sortOrder: 8,  enabled: true, isPreset: true },
  { id: 'preset-exp-09', type: 'expense', name: '数码',     icon: 'smartphone',      colorTokenBg: 'slate-100',   colorTokenText: 'text-slate-500',   sortOrder: 9,  enabled: true, isPreset: true },
  { id: 'preset-exp-10', type: 'expense', name: '运动',     icon: 'dumbbell',        colorTokenBg: 'emerald-100', colorTokenText: 'text-emerald-500', sortOrder: 10, enabled: true, isPreset: true },
  { id: 'preset-exp-11', type: 'expense', name: '宠物',     icon: 'cat',             colorTokenBg: 'amber-100',   colorTokenText: 'text-amber-600',   sortOrder: 11, enabled: true, isPreset: true },
  { id: 'preset-exp-12', type: 'expense', name: '水电燃气', icon: 'zap',             colorTokenBg: 'yellow-100',  colorTokenText: 'text-yellow-600',  sortOrder: 12, enabled: true, isPreset: true },
  { id: 'preset-exp-13', type: 'expense', name: '通讯网费', icon: 'wifi',            colorTokenBg: 'sky-100',     colorTokenText: 'text-sky-500',     sortOrder: 13, enabled: true, isPreset: true },
  { id: 'preset-exp-14', type: 'expense', name: '美容美发', icon: 'scissors',        colorTokenBg: 'pink-100',    colorTokenText: 'text-pink-500',    sortOrder: 14, enabled: true, isPreset: true },
  { id: 'preset-exp-15', type: 'expense', name: '汽车养护', icon: 'car',             colorTokenBg: 'slate-100',   colorTokenText: 'text-slate-500',   sortOrder: 15, enabled: true, isPreset: true },
  { id: 'preset-exp-16', type: 'expense', name: '书籍学习', icon: 'book-open',       colorTokenBg: 'indigo-100',  colorTokenText: 'text-indigo-500',  sortOrder: 16, enabled: true, isPreset: true },
  { id: 'preset-exp-17', type: 'expense', name: '亲子宝贝', icon: 'baby',            colorTokenBg: 'rose-100',    colorTokenText: 'text-rose-500',    sortOrder: 17, enabled: true, isPreset: true },
  { id: 'preset-exp-18', type: 'expense', name: '其他',     icon: 'more-horizontal', colorTokenBg: 'gray-100',    colorTokenText: 'text-gray-500',    sortOrder: 18, enabled: true, isPreset: true },
];

const PRESET_INCOME: PresetCategory[] = [
  { id: 'preset-inc-01', type: 'income', name: '工资', icon: 'banknote',    colorTokenBg: 'orange-100', colorTokenText: 'text-orange-500', sortOrder: 1, enabled: true, isPreset: true },
  { id: 'preset-inc-02', type: 'income', name: '理财', icon: 'trending-up', colorTokenBg: 'red-100',    colorTokenText: 'text-red-500',    sortOrder: 2, enabled: true, isPreset: true },
  { id: 'preset-inc-03', type: 'income', name: '兼职', icon: 'briefcase',   colorTokenBg: 'blue-100',   colorTokenText: 'text-blue-500',   sortOrder: 3, enabled: true, isPreset: true },
  { id: 'preset-inc-04', type: 'income', name: '礼金', icon: 'gift',        colorTokenBg: 'pink-100',   colorTokenText: 'text-pink-500',   sortOrder: 4, enabled: true, isPreset: true },
];

/**
 * 初始化预设分类（幂等：首次启动才写入）
 */
export async function seedPresetCategories(): Promise<void> {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .limit(1);

  if (existing.length > 0) return;

  const now = new Date().toISOString();
  const all = [...PRESET_EXPENSE, ...PRESET_INCOME].map((c) => ({
    ...c,
    createdAt: now,
    updatedAt: now,
  }));

  await db.insert(categories).values(all);
}
