export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // --- STRICT YYYY-MM-DD FORMAT ---
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
  if (!match) return null;

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // --- VALIDATE MONTH AND DAY RANGES ---
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);

  // --- CHECK FOR JS DATE OVERFLOW ---
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
