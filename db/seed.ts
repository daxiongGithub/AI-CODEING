import { db } from "./client";
import { categories, subCategories } from "./schema";
import type { NewCategory } from "@/types";

type NewSubCategoryPreset = {
  id: string;
  parentCategoryId: string;
  name: string;
  icon: string;
  sortOrder: number;
  enabled: boolean;
};

type PresetCategory = Omit<NewCategory, "createdAt" | "updatedAt">;

const PRESET_EXPENSE: PresetCategory[] = [
  {
    id: "preset-exp-01",
    type: "expense",
    name: "餐饮",
    icon: "utensils",
    colorTokenBg: "orange-100",
    colorTokenText: "text-orange-500",
    sortOrder: 1,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-02",
    type: "expense",
    name: "购物",
    icon: "shopping-bag",
    colorTokenBg: "blue-100",
    colorTokenText: "text-blue-500",
    sortOrder: 2,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-03",
    type: "expense",
    name: "交通",
    icon: "bus",
    colorTokenBg: "green-100",
    colorTokenText: "text-green-500",
    sortOrder: 3,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-04",
    type: "expense",
    name: "娱乐",
    icon: "gamepad-2",
    colorTokenBg: "purple-100",
    colorTokenText: "text-purple-500",
    sortOrder: 4,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-05",
    type: "expense",
    name: "居住",
    icon: "home",
    colorTokenBg: "yellow-100",
    colorTokenText: "text-yellow-600",
    sortOrder: 5,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-06",
    type: "expense",
    name: "医疗",
    icon: "heart-pulse",
    colorTokenBg: "red-100",
    colorTokenText: "text-red-500",
    sortOrder: 6,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-07",
    type: "expense",
    name: "教育",
    icon: "graduation-cap",
    colorTokenBg: "indigo-100",
    colorTokenText: "text-indigo-500",
    sortOrder: 7,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-08",
    type: "expense",
    name: "旅行",
    icon: "plane",
    colorTokenBg: "cyan-100",
    colorTokenText: "text-cyan-500",
    sortOrder: 8,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-09",
    type: "expense",
    name: "数码",
    icon: "smartphone",
    colorTokenBg: "slate-100",
    colorTokenText: "text-slate-500",
    sortOrder: 9,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-10",
    type: "expense",
    name: "运动",
    icon: "dumbbell",
    colorTokenBg: "emerald-100",
    colorTokenText: "text-emerald-500",
    sortOrder: 10,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-11",
    type: "expense",
    name: "宠物",
    icon: "cat",
    colorTokenBg: "amber-100",
    colorTokenText: "text-amber-600",
    sortOrder: 11,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-12",
    type: "expense",
    name: "水电燃气",
    icon: "zap",
    colorTokenBg: "yellow-100",
    colorTokenText: "text-yellow-600",
    sortOrder: 12,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-13",
    type: "expense",
    name: "通讯网费",
    icon: "wifi",
    colorTokenBg: "sky-100",
    colorTokenText: "text-sky-500",
    sortOrder: 13,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-14",
    type: "expense",
    name: "美容美发",
    icon: "scissors",
    colorTokenBg: "pink-100",
    colorTokenText: "text-pink-500",
    sortOrder: 14,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-15",
    type: "expense",
    name: "汽车养护",
    icon: "car",
    colorTokenBg: "slate-100",
    colorTokenText: "text-slate-500",
    sortOrder: 15,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-16",
    type: "expense",
    name: "书籍学习",
    icon: "book-open",
    colorTokenBg: "indigo-100",
    colorTokenText: "text-indigo-500",
    sortOrder: 16,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-17",
    type: "expense",
    name: "亲子宝贝",
    icon: "baby",
    colorTokenBg: "rose-100",
    colorTokenText: "text-rose-500",
    sortOrder: 17,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-exp-18",
    type: "expense",
    name: "其他",
    icon: "more-horizontal",
    colorTokenBg: "gray-100",
    colorTokenText: "text-gray-500",
    sortOrder: 18,
    enabled: true,
    isPreset: true,
  },
];

const PRESET_INCOME: PresetCategory[] = [
  {
    id: "preset-inc-01",
    type: "income",
    name: "工资",
    icon: "banknote",
    colorTokenBg: "orange-100",
    colorTokenText: "text-orange-500",
    sortOrder: 1,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-inc-02",
    type: "income",
    name: "理财",
    icon: "trending-up",
    colorTokenBg: "red-100",
    colorTokenText: "text-red-500",
    sortOrder: 2,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-inc-03",
    type: "income",
    name: "兼职",
    icon: "briefcase",
    colorTokenBg: "blue-100",
    colorTokenText: "text-blue-500",
    sortOrder: 3,
    enabled: true,
    isPreset: true,
  },
  {
    id: "preset-inc-04",
    type: "income",
    name: "礼金",
    icon: "gift",
    colorTokenBg: "pink-100",
    colorTokenText: "text-pink-500",
    sortOrder: 4,
    enabled: true,
    isPreset: true,
  },
];

/**
 * 预设二级分类
 * parentCategoryId 对应上方一级分类的 id（preset-exp-xx / preset-inc-xx）
 */
const PRESET_SUB: NewSubCategoryPreset[] = [
  // ── 餐饮 (preset-exp-01) ─────────────────────────────────────────
  { id: "preset-sub-exp-01-01", parentCategoryId: "preset-exp-01", name: "早餐",       icon: "egg",            sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-01-02", parentCategoryId: "preset-exp-01", name: "午餐",       icon: "utensils",       sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-01-03", parentCategoryId: "preset-exp-01", name: "晚餐",       icon: "utensils-crossed", sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-01-04", parentCategoryId: "preset-exp-01", name: "咖啡/奶茶",  icon: "coffee",         sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-01-05", parentCategoryId: "preset-exp-01", name: "零食点心",   icon: "cookie",         sortOrder: 5, enabled: true },
  { id: "preset-sub-exp-01-06", parentCategoryId: "preset-exp-01", name: "外卖",       icon: "sandwich",       sortOrder: 6, enabled: true },
  { id: "preset-sub-exp-01-07", parentCategoryId: "preset-exp-01", name: "酒水饮料",   icon: "wine",           sortOrder: 7, enabled: true },

  // ── 购物 (preset-exp-02) ─────────────────────────────────────────
  { id: "preset-sub-exp-02-01", parentCategoryId: "preset-exp-02", name: "服装鞋包",   icon: "shirt",          sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-02-02", parentCategoryId: "preset-exp-02", name: "日用百货",   icon: "shopping-cart",  sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-02-03", parentCategoryId: "preset-exp-02", name: "网购",       icon: "package",        sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-02-04", parentCategoryId: "preset-exp-02", name: "化妆品",     icon: "sparkles",       sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-02-05", parentCategoryId: "preset-exp-02", name: "礼品",       icon: "gift",           sortOrder: 5, enabled: true },
  { id: "preset-sub-exp-02-06", parentCategoryId: "preset-exp-02", name: "食材采购",   icon: "shopping-bag",   sortOrder: 6, enabled: true },

  // ── 交通 (preset-exp-03) ─────────────────────────────────────────
  { id: "preset-sub-exp-03-01", parentCategoryId: "preset-exp-03", name: "地铁/公交",  icon: "train",          sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-03-02", parentCategoryId: "preset-exp-03", name: "打车",       icon: "car",            sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-03-03", parentCategoryId: "preset-exp-03", name: "共享单车",   icon: "bike",           sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-03-04", parentCategoryId: "preset-exp-03", name: "高铁/火车",  icon: "train",          sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-03-05", parentCategoryId: "preset-exp-03", name: "停车费",     icon: "map-pin",        sortOrder: 5, enabled: true },
  { id: "preset-sub-exp-03-06", parentCategoryId: "preset-exp-03", name: "加油",       icon: "fuel",           sortOrder: 6, enabled: true },

  // ── 娱乐 (preset-exp-04) ─────────────────────────────────────────
  { id: "preset-sub-exp-04-01", parentCategoryId: "preset-exp-04", name: "电影/剧集",  icon: "film",           sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-04-02", parentCategoryId: "preset-exp-04", name: "游戏",       icon: "gamepad-2",      sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-04-03", parentCategoryId: "preset-exp-04", name: "演出/展览",  icon: "ticket",         sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-04-04", parentCategoryId: "preset-exp-04", name: "KTV/酒吧",   icon: "music",          sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-04-05", parentCategoryId: "preset-exp-04", name: "游乐园",     icon: "smile",          sortOrder: 5, enabled: true },
  { id: "preset-sub-exp-04-06", parentCategoryId: "preset-exp-04", name: "会员订阅",   icon: "tv",             sortOrder: 6, enabled: true },

  // ── 居住 (preset-exp-05) ─────────────────────────────────────────
  { id: "preset-sub-exp-05-01", parentCategoryId: "preset-exp-05", name: "房租",       icon: "house",          sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-05-02", parentCategoryId: "preset-exp-05", name: "房贷",       icon: "landmark",       sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-05-03", parentCategoryId: "preset-exp-05", name: "物业/停车",  icon: "building-2",     sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-05-04", parentCategoryId: "preset-exp-05", name: "家居装修",   icon: "hammer",         sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-05-05", parentCategoryId: "preset-exp-05", name: "家电维修",   icon: "wrench",         sortOrder: 5, enabled: true },
  { id: "preset-sub-exp-05-06", parentCategoryId: "preset-exp-05", name: "家居用品",   icon: "home",           sortOrder: 6, enabled: true },

  // ── 医疗 (preset-exp-06) ─────────────────────────────────────────
  { id: "preset-sub-exp-06-01", parentCategoryId: "preset-exp-06", name: "门诊挂号",   icon: "stethoscope",    sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-06-02", parentCategoryId: "preset-exp-06", name: "药品",       icon: "pill",           sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-06-03", parentCategoryId: "preset-exp-06", name: "体检",       icon: "activity",       sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-06-04", parentCategoryId: "preset-exp-06", name: "保险",       icon: "shield-check",   sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-06-05", parentCategoryId: "preset-exp-06", name: "住院",       icon: "hospital",       sortOrder: 5, enabled: true },

  // ── 教育 (preset-exp-07) ─────────────────────────────────────────
  { id: "preset-sub-exp-07-01", parentCategoryId: "preset-exp-07", name: "培训课程",   icon: "graduation-cap", sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-07-02", parentCategoryId: "preset-exp-07", name: "书籍文具",   icon: "book-open",      sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-07-03", parentCategoryId: "preset-exp-07", name: "学费",       icon: "pencil",         sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-07-04", parentCategoryId: "preset-exp-07", name: "在线学习",   icon: "laptop",         sortOrder: 4, enabled: true },

  // ── 旅行 (preset-exp-08) ─────────────────────────────────────────
  { id: "preset-sub-exp-08-01", parentCategoryId: "preset-exp-08", name: "机票",       icon: "plane",          sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-08-02", parentCategoryId: "preset-exp-08", name: "酒店住宿",   icon: "bed",            sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-08-03", parentCategoryId: "preset-exp-08", name: "景点门票",   icon: "ticket",         sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-08-04", parentCategoryId: "preset-exp-08", name: "旅游购物",   icon: "shopping-bag",   sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-08-05", parentCategoryId: "preset-exp-08", name: "当地交通",   icon: "map",            sortOrder: 5, enabled: true },

  // ── 数码 (preset-exp-09) ─────────────────────────────────────────
  { id: "preset-sub-exp-09-01", parentCategoryId: "preset-exp-09", name: "手机",       icon: "smartphone",     sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-09-02", parentCategoryId: "preset-exp-09", name: "电脑/平板",  icon: "laptop",         sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-09-03", parentCategoryId: "preset-exp-09", name: "外设配件",   icon: "keyboard",       sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-09-04", parentCategoryId: "preset-exp-09", name: "软件/应用",  icon: "cpu",            sortOrder: 4, enabled: true },

  // ── 运动 (preset-exp-10) ─────────────────────────────────────────
  { id: "preset-sub-exp-10-01", parentCategoryId: "preset-exp-10", name: "健身房",     icon: "dumbbell",       sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-10-02", parentCategoryId: "preset-exp-10", name: "运动装备",   icon: "backpack",       sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-10-03", parentCategoryId: "preset-exp-10", name: "球类运动",   icon: "trophy",         sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-10-04", parentCategoryId: "preset-exp-10", name: "户外运动",   icon: "mountain",       sortOrder: 4, enabled: true },
  { id: "preset-sub-exp-10-05", parentCategoryId: "preset-exp-10", name: "游泳",       icon: "waves",          sortOrder: 5, enabled: true },

  // ── 宠物 (preset-exp-11) ─────────────────────────────────────────
  { id: "preset-sub-exp-11-01", parentCategoryId: "preset-exp-11", name: "宠物食品",   icon: "cat",            sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-11-02", parentCategoryId: "preset-exp-11", name: "宠物医疗",   icon: "heart-pulse",    sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-11-03", parentCategoryId: "preset-exp-11", name: "宠物用品",   icon: "dog",            sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-11-04", parentCategoryId: "preset-exp-11", name: "宠物美容",   icon: "scissors",       sortOrder: 4, enabled: true },

  // ── 水电燃气 (preset-exp-12) ──────────────────────────────────────
  { id: "preset-sub-exp-12-01", parentCategoryId: "preset-exp-12", name: "电费",       icon: "zap",            sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-12-02", parentCategoryId: "preset-exp-12", name: "水费",       icon: "droplets",       sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-12-03", parentCategoryId: "preset-exp-12", name: "燃气费",     icon: "flame",          sortOrder: 3, enabled: true },

  // ── 通讯网费 (preset-exp-13) ──────────────────────────────────────
  { id: "preset-sub-exp-13-01", parentCategoryId: "preset-exp-13", name: "手机话费",   icon: "phone",          sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-13-02", parentCategoryId: "preset-exp-13", name: "宽带费",     icon: "wifi",           sortOrder: 2, enabled: true },

  // ── 美容美发 (preset-exp-14) ──────────────────────────────────────
  { id: "preset-sub-exp-14-01", parentCategoryId: "preset-exp-14", name: "理发",       icon: "scissors",       sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-14-02", parentCategoryId: "preset-exp-14", name: "护肤/美妆",  icon: "sparkles",       sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-14-03", parentCategoryId: "preset-exp-14", name: "美甲/美睫",  icon: "gem",            sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-14-04", parentCategoryId: "preset-exp-14", name: "SPA/按摩",   icon: "heart-handshake", sortOrder: 4, enabled: true },

  // ── 汽车养护 (preset-exp-15) ──────────────────────────────────────
  { id: "preset-sub-exp-15-01", parentCategoryId: "preset-exp-15", name: "保险",       icon: "shield-check",   sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-15-02", parentCategoryId: "preset-exp-15", name: "保养维修",   icon: "wrench",         sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-15-03", parentCategoryId: "preset-exp-15", name: "洗车",       icon: "droplets",       sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-15-04", parentCategoryId: "preset-exp-15", name: "违章罚款",   icon: "alert-circle",   sortOrder: 4, enabled: true },

  // ── 书籍学习 (preset-exp-16) ──────────────────────────────────────
  { id: "preset-sub-exp-16-01", parentCategoryId: "preset-exp-16", name: "书籍",       icon: "book-open",      sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-16-02", parentCategoryId: "preset-exp-16", name: "文具",       icon: "pencil",         sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-16-03", parentCategoryId: "preset-exp-16", name: "课程订阅",   icon: "laptop",         sortOrder: 3, enabled: true },

  // ── 亲子宝贝 (preset-exp-17) ──────────────────────────────────────
  { id: "preset-sub-exp-17-01", parentCategoryId: "preset-exp-17", name: "奶粉/辅食",  icon: "milk",           sortOrder: 1, enabled: true },
  { id: "preset-sub-exp-17-02", parentCategoryId: "preset-exp-17", name: "早教/托育",  icon: "baby",           sortOrder: 2, enabled: true },
  { id: "preset-sub-exp-17-03", parentCategoryId: "preset-exp-17", name: "玩具",       icon: "gamepad",        sortOrder: 3, enabled: true },
  { id: "preset-sub-exp-17-04", parentCategoryId: "preset-exp-17", name: "童装",       icon: "shirt",          sortOrder: 4, enabled: true },

  // ── 收入：工资 (preset-inc-01) ────────────────────────────────────
  { id: "preset-sub-inc-01-01", parentCategoryId: "preset-inc-01", name: "基本工资",   icon: "banknote",       sortOrder: 1, enabled: true },
  { id: "preset-sub-inc-01-02", parentCategoryId: "preset-inc-01", name: "奖金",       icon: "award",          sortOrder: 2, enabled: true },
  { id: "preset-sub-inc-01-03", parentCategoryId: "preset-inc-01", name: "年终奖",     icon: "trophy",         sortOrder: 3, enabled: true },
  { id: "preset-sub-inc-01-04", parentCategoryId: "preset-inc-01", name: "加班费",     icon: "clock",          sortOrder: 4, enabled: true },

  // ── 收入：理财 (preset-inc-02) ────────────────────────────────────
  { id: "preset-sub-inc-02-01", parentCategoryId: "preset-inc-02", name: "基金",       icon: "trending-up",    sortOrder: 1, enabled: true },
  { id: "preset-sub-inc-02-02", parentCategoryId: "preset-inc-02", name: "股票",       icon: "trending-up",    sortOrder: 2, enabled: true },
  { id: "preset-sub-inc-02-03", parentCategoryId: "preset-inc-02", name: "利息",       icon: "piggy-bank",     sortOrder: 3, enabled: true },
  { id: "preset-sub-inc-02-04", parentCategoryId: "preset-inc-02", name: "分红",       icon: "coins",          sortOrder: 4, enabled: true },

  // ── 收入：兼职 (preset-inc-03) ────────────────────────────────────
  { id: "preset-sub-inc-03-01", parentCategoryId: "preset-inc-03", name: "接单/外包",  icon: "briefcase",      sortOrder: 1, enabled: true },
  { id: "preset-sub-inc-03-02", parentCategoryId: "preset-inc-03", name: "稿费版税",   icon: "file-text",      sortOrder: 2, enabled: true },
  { id: "preset-sub-inc-03-03", parentCategoryId: "preset-inc-03", name: "直播/广告",  icon: "video",          sortOrder: 3, enabled: true },
  { id: "preset-sub-inc-03-04", parentCategoryId: "preset-inc-03", name: "租金收入",   icon: "key",            sortOrder: 4, enabled: true },

  // ── 收入：礼金 (preset-inc-04) ────────────────────────────────────
  { id: "preset-sub-inc-04-01", parentCategoryId: "preset-inc-04", name: "红包",       icon: "gift",           sortOrder: 1, enabled: true },
  { id: "preset-sub-inc-04-02", parentCategoryId: "preset-inc-04", name: "生日礼金",   icon: "party-popper",   sortOrder: 2, enabled: true },
  { id: "preset-sub-inc-04-03", parentCategoryId: "preset-inc-04", name: "借款还款",   icon: "hand-coins",     sortOrder: 3, enabled: true },
  { id: "preset-sub-inc-04-04", parentCategoryId: "preset-inc-04", name: "报销",       icon: "receipt",        sortOrder: 4, enabled: true },
];

/**
 * 初始化预设分类（幂等：首次启动才写入）
 */
export async function seedPresetCategories(): Promise<void> {
  const [existingCats, existingSubs] = await Promise.all([
    db.select({ id: categories.id }).from(categories).limit(1),
    db.select({ id: subCategories.id }).from(subCategories).limit(1),
  ]);

  // 一级分类尚未写入时才插入
  if (existingCats.length === 0) {
    const now = new Date().toISOString();
    const allCategories = [...PRESET_EXPENSE, ...PRESET_INCOME].map((c) => ({
      ...c,
      createdAt: now,
      updatedAt: now,
    }));
    await db.insert(categories).values(allCategories);
  }

  // 二级分类尚未写入时才插入（独立判断，兼容旧数据库升级场景）
  if (existingSubs.length === 0) {
    await db.insert(subCategories).values(PRESET_SUB);
  }
}
