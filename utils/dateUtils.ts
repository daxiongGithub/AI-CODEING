import dayjs from 'dayjs';

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

export function getTodayISO(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function isToday(date: string): boolean {
  return date === getTodayISO();
}

export function isYesterday(date: string): boolean {
  return date === dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

export function getDateLabel(date: string): string {
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  return dayjs(date).format('YYYY年M月D日');
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}年${month}月`;
}
