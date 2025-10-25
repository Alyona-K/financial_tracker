import { parseDate } from "@/shared/lib/parseDate";

export function formatDate(dateString: string) {
  const date = parseDate(dateString);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
