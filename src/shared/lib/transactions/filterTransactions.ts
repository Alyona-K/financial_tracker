import { Transaction } from "@/entities/transaction/model/transaction.types";

export function filterTransactionsByCategory<T extends Transaction>(
  transactions: T[],
  selectedCategoryName: string,
  categories: { id: string; name: string }[]
): T[] {
  return transactions.filter((tx) => {
    const txCategoryName =
      categories.find((c) => c.id === tx.categoryId)?.name || "Deleted";
    return txCategoryName === selectedCategoryName;
  });
}

export function filterTransactionsByType<T extends Transaction>(
  transactions: T[],
  type: "Income" | "Expenses"
): T[] {
  return transactions.filter((tx) => tx.type === type);
}
