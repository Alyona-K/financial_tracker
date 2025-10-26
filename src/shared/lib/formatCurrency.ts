export function formatCurrency(amount: number, type: "Income" | "Expenses") {
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);

  return type === "Income" ? `+${formatted}` : `-${formatted}`;
}
