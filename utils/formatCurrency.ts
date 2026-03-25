/**
 * 金额格式化：¥1,234.56
 */
export function formatCurrency(amount: number, symbol = "¥"): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${symbol}${formatted}`;
}

/**
 * 仅格式化数字，保留两位小数
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * 解析金额字符串为数字，保留最多 2 位小数
 */
export function parseAmount(value: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.round(num * 100) / 100;
}

/**
 * 校验金额是否合法（>0 且 ≤999999.99）
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 999999.99;
}
