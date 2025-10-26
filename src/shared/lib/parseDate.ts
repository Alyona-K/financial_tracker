export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // строгий формат YYYY-MM-DD
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
  if (!match) return null;

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // валидируем диапазоны месяца и дня
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null; // можно расширить для точного числа дней в месяце

  const date = new Date(year, month - 1, day);

  // проверка: JS может прокрутить даты, например, 2025-02-30 -> Mar 02
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
