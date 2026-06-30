/** 格式化日期为 YYYY-MM-DD */
export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 格式化日期显示 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 计算两个日期之间的天数 */
export function daysBetween(d1: string, d2: string): number {
  return Math.round((new Date(d2).getTime() - new Date(d1).getTime()) / 86400000);
}

/** 剩余天数 */
export function daysRemaining(targetDate: string): number {
  const remaining = daysBetween(todayStr(), targetDate);
  return Math.max(0, remaining);
}

/** 获取本周一日期 */
export function getMonday(date?: Date): string {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

/** 获取本周所有日期 */
export function getWeekDates(): string[] {
  const monday = getMonday();
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/** 判断是否为今天 */
export function isToday(dateStr: string): boolean {
  return dateStr === todayStr();
}

/** 获取过去N天的日期列表 */
export function lastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}
