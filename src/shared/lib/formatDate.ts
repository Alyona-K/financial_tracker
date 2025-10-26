import { parseDate } from "@/shared/lib/parseDate";

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(dateString: string) {
  const date = parseDate(dateString);
  if (!date) return "";

  const year = date.getFullYear();
  const month = MONTHS_SHORT[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}
