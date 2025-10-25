export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // создаём локальную дату без смещения
  const parts = dateString.split("-").map(Number); // [YYYY, MM, DD]
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day); // month - 1, потому что JS считает с 0
  return date;
}



