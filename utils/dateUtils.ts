import dayjs from 'dayjs';

/** 
 * 返回指定年月的起止日期（ISO 格式 YYYY-MM-DD）。
 * @param year - 年份（例如 2024）
 * @param month - 月份（1-12）
 * @returns 对象包含 `start`（当月第一天）和 `end`（当月最后一天）的 ISO 字符串
 */
export function getMonthRange(
  year: number,
  month: number,
): { start: string; end: string } {
  const start = dayjs(
    `${year}-${String(month).padStart(2, '0')}-01`,
  ).format('YYYY-MM-DD');
  const end = dayjs(start).endOf('month').format('YYYY-MM-DD');
  return { start, end };
}

/**
 * 获取今天的 ISO 日期字符串（YYYY-MM-DD）。
 * 用于和存储在 DB 中的日期字段比对。
 */
export function getTodayISO(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 判断给定日期字符串是否为今天（精确到日，格式应为 YYYY-MM-DD）。
 * @param date - ISO 日期字符串
 */
export function isToday(date: string): boolean {
  return date === getTodayISO();
}

/**
 * 判断给定日期字符串是否为昨天（精确到日，格式应为 YYYY-MM-DD）。
 * @param date - ISO 日期字符串
 */
export function isYesterday(date: string): boolean {
  return date === dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

/**
 * 根据日期返回用于 UI 的显示标签：
 * - 今天 -> '今天'
 * - 昨天 -> '昨天'
 * - 其他 -> 'YYYY年M月D日'
 * @param date - ISO 日期字符串
 */
export function getDateLabel(date: string): string {
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  return dayjs(date).format('YYYY年M月D日');
}

/**
 * 格式化月份标题，例如 `2024年3月`，用于日历/列表页面的标题。
 * @param year - 年份
 * @param month - 月份（数字）
 */
export function formatMonthTitle(year: number, month: number): string {
  return `${year}年${month}月`;
}
