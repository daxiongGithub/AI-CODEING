/**
 * theme.ts — PocketBook 设计系统 Token 汇总
 *
 * 本文件对齐 PocketBookV2.pen > "Design System" 页面中的全部变量。
 * 禁止在业务代码中硬编码颜色十六进制值，统一从此处引入。
 *
 * 分区目录：
 *  1. 语义色（Semantic Colors）— 主品牌色、功能色
 *  2. 文字色（Text Colors）
 *  3. 背景色（Background Colors）
 *  4. 边框色（Border Colors）
 *  5. 辅助色 / 向后兼容（Utility Aliases）
 *  6. 图表调色板（Chart Palette）
 *  7. 字体规范（Typography Scale）
 *  8. 间距规范（Spacing Scale）
 *  9. 圆角规范（Border Radius Scale）
 * 10. NativeWind Token 映射（动态 style 兜底）
 */

// ─────────────────────────────────────────────────────────
// 1. 语义色（Semantic Colors）
// ─────────────────────────────────────────────────────────

/** 品牌主色，用于主按钮、高亮标记、选中态   → $primary (#F97316 orange-500) */
export const BRAND_COLOR = "#f97316";

/** 主色文字（用于品牌色背景上的白色反色字）   → $on_primary */
export const ON_PRIMARY_COLOR = "#ffffff";

/** 成功 / 收入色                              → $success (#10B981 emerald-500) */
export const SUCCESS_COLOR = "#10b981";

/** 危险 / 支出色                              → $danger (#EF4444 red-500) */
export const DANGER_COLOR = "#ef4444";

/** 辅助强调色（蓝色系，提醒/信息）           → $accent (#3B82F6 blue-500) */
export const ACCENT_COLOR = "#3b82f6";

// ─────────────────────────────────────────────────────────
// 2. 文字色（Text Colors）
// ─────────────────────────────────────────────────────────

/** 主文字色，标题、正文                       → $text_main (#18181B zinc-900) */
export const TEXT_MAIN_COLOR = "#18181b";

/** 次级文字色，辅助信息、占位符               → $text_secondary (#71717A zinc-500) */
export const TEXT_SECONDARY_COLOR = "#71717a";

/** 反色文字（白色背景上的深色按钮等）         → $text_inverse */
export const TEXT_INVERSE_COLOR = "#ffffff";

/** 禁用 / 极淡提示文字                        → zinc-400 */
export const TEXT_DISABLED_COLOR = "#a1a1aa";

// ─────────────────────────────────────────────────────────
// 3. 背景色（Background Colors）
// ─────────────────────────────────────────────────────────

/** 页面底色（App 根背景）                     → $background (#FAFAFA zinc-50) */
export const BACKGROUND_COLOR = "#fafafa";

/** 卡片 / 面板背景                            → $surface (#FFFFFF) */
export const SURFACE_COLOR = "#ffffff";

/** 品牌 / 主题色背景（选中态浅橙底）          → $primary_bg (#FFF7ED orange-50) */
export const PRIMARY_BG_COLOR = "#fff7ed";

/** 输入框 / 选择框背景                        → $bg_input (#F9FAFB gray-50) */
export const BG_INPUT_COLOR = "#f9fafb";

/** 悬停 / 点击反馈背景                        → $bg_hover (#F4F4F5 zinc-100) */
export const BG_HOVER_COLOR = "#f4f4f5";

/** 弹框遮罩层背景（40% 透明黑）              → $bg_overlay */
export const BG_OVERLAY_COLOR = "rgba(0,0,0,0.4)";

/** 次级按钮背景（轻量灰）                     → $secondary (#F1F5F9 slate-100) */
export const SECONDARY_BG_COLOR = "#f1f5f9";

// ─────────────────────────────────────────────────────────
// 4. 边框色（Border Colors）
// ─────────────────────────────────────────────────────────

/** 通用分割线 / 卡片描边                      → $border (#E4E4E7 zinc-200) */
export const BORDER_COLOR = "#e4e4e7";

// ─────────────────────────────────────────────────────────
// 5. 辅助色 / 向后兼容（Utility Aliases）
//    以下别名保留供已有代码直接使用
// ─────────────────────────────────────────────────────────

/** @deprecated 使用 SUCCESS_COLOR 代替 */
export const INCOME_COLOR = SUCCESS_COLOR;

/** @deprecated 使用 DANGER_COLOR 代替 */
export const EXPENSE_COLOR = DANGER_COLOR;

/** @deprecated 使用 ACCENT_COLOR 代替 */
export const BLUE_COLOR = ACCENT_COLOR;

/** @deprecated 使用 BG_TOKEN_MAP['blue-100'] 代替 */
export const BLUE_BG_COLOR = "#dbeafe";

/** @deprecated 使用 BG_TOKEN_MAP['emerald-100'] 代替 */
export const EMERALD_BG_COLOR = "#d1fae5";

// ─────────────────────────────────────────────────────────
// 6. 图表调色板（Chart Palette）
//    对齐设计文件 chart_1~4 变量
// ─────────────────────────────────────────────────────────

/** 图表色 1 — 橙 #FDBA74 (orange-300)  → $chart_1 */
export const CHART_COLOR_1 = "#fdba74";

/** 图表色 2 — 绿 #6EE7B7 (emerald-300) → $chart_2 */
export const CHART_COLOR_2 = "#6ee7b7";

/** 图表色 3 — 蓝 #93C5FD (blue-300)    → $chart_3 */
export const CHART_COLOR_3 = "#93c5fd";

/** 图表色 4 — 玫 #FDA4AF (rose-300)    → $chart_4 */
export const CHART_COLOR_4 = "#fda4af";

/** 图表调色板数组，按序循环使用 */
export const CHART_PALETTE = [
  CHART_COLOR_1,
  CHART_COLOR_2,
  CHART_COLOR_3,
  CHART_COLOR_4,
] as const;

// ─────────────────────────────────────────────────────────
// 7. 字体规范（Typography Scale）
//    对齐设计文件 "字体规范" 段落
// ─────────────────────────────────────────────────────────

/** Display — 特大标题，金额展示等  36px bold */
export const FONT_SIZE_DISPLAY = 36;

/** Heading 1 — 页面标题           24px 600 */
export const FONT_SIZE_H1 = 24;

/** Heading 2 — 区块小标题         20px 600 */
export const FONT_SIZE_H2 = 20;

/** Heading 3 — 卡片标题           17px 600 */
export const FONT_SIZE_H3 = 17;

/** Body — 列表正文                15px normal */
export const FONT_SIZE_BODY = 15;

/** Body Small — 细节描述          13px normal */
export const FONT_SIZE_BODY_SM = 13;

/** Caption — 辅助说明、标签       10px normal */
export const FONT_SIZE_CAPTION = 10;

// ─────────────────────────────────────────────────────────
// 8. 间距规范（Spacing Scale）
//    对齐设计文件 space_xs~xl 变量
// ─────────────────────────────────────────────────────────

/** 极小间距  4px  → $space_xs */
export const SPACE_XS = 4;

/** 小间距    8px  → $space_sm */
export const SPACE_SM = 8;

/** 中间距   12px  → $space_md */
export const SPACE_MD = 12;

/** 大间距   16px  → $space_lg */
export const SPACE_LG = 16;

/** 超大间距 24px  → $space_xl */
export const SPACE_XL = 24;

// ─────────────────────────────────────────────────────────
// 9. 圆角规范（Border Radius Scale）
//    对齐设计文件 radius_sm~full 变量
// ─────────────────────────────────────────────────────────

/** 小圆角  6px   → $radius_sm */
export const RADIUS_SM = 6;

/** 中圆角  8px   → $radius_md */
export const RADIUS_MD = 8;

/** 大圆角 12px   → $radius_lg */
export const RADIUS_LG = 12;

/** 全圆角 999px  → $radius_full（Pill / 圆形按钮） */
export const RADIUS_FULL = 999;

// ─────────────────────────────────────────────────────────
// 10. NativeWind Token 映射（动态 style 兜底）
//     用于无法使用 className 时的内联 style 颜色查找。
//     key 与 Tailwind 类名（去除前缀）保持一致。
// ─────────────────────────────────────────────────────────

/**
 * 图标 / 标签背景色 Token Map
 * key 格式：'{color}-{shade}'，与数据库 colorTokenBg 字段对齐
 */
export const BG_TOKEN_MAP: Record<string, string> = {
  "orange-100": "#ffedd5", // $color_orange_bg
  "blue-100": "#dbeafe", // $color_blue_bg
  "green-100": "#dcfce7", // $color_green_bg
  "purple-100": "#f3e8ff", // $color_purple_bg
  "yellow-100": "#fef9c3", // $color_yellow_bg
  "red-100": "#fee2e2", // $color_red_bg
  "indigo-100": "#e0e7ff", // $color_indigo_bg
  "cyan-100": "#cffafe", // $color_cyan_bg
  "slate-100": "#f1f5f9", // $color_slate_bg
  "emerald-100": "#d1fae5", // $color_emerald_bg
  "amber-100": "#fef3c7", // $color_amber_bg
  "sky-100": "#e0f2fe", // $color_sky_bg
  "pink-100": "#fce7f3", // $color_pink_bg
  "rose-100": "#ffe4e6", // rose-100
  "gray-100": "#f3f4f6", // $color_gray_bg
  "teal-100": "#f0fdfa", // $color_teal_bg
};

/**
 * 图标 / 标签文字色 Token Map
 * key 格式：'text-{color}-{shade}'，与数据库 colorTokenText 字段对齐
 */
export const TEXT_TOKEN_MAP: Record<string, string> = {
  "text-orange-500": "#f97316", // $color_orange_text
  "text-blue-500": "#3b82f6", // $color_blue_text
  "text-green-500": "#22c55e", // $color_green_text
  "text-purple-500": "#a855f7", // $color_purple_text
  "text-yellow-600": "#ca8a04", // $color_yellow_text
  "text-red-500": "#ef4444", // $color_red_text
  "text-indigo-500": "#6366f1", // $color_indigo_text
  "text-cyan-500": "#06b6d4", // $color_cyan_text
  "text-slate-500": "#64748b", // $color_slate_text
  "text-emerald-500": "#10b981", // $color_emerald_text
  "text-amber-600": "#d97706", // $color_amber_text
  "text-sky-500": "#0ea5e9", // $color_sky_text
  "text-pink-500": "#ec4899", // $color_pink_text
  "text-rose-500": "#f43f5e", // rose-500
  "text-gray-500": "#6b7280", // $color_gray_text
  "text-teal-500": "#2dd4bf", // $color_teal_text
};
