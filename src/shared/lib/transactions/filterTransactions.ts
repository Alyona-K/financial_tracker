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

// Универсальная фильтрация по типу
export function filterTransactionsByType<T extends Transaction>(
  transactions: T[],
  type: "Income" | "Expenses"
): T[] {
  return transactions.filter((tx) => tx.type === type);
}

//---------
// import { Transaction } from "@/entities/transaction/model/transaction.types";

// export function filterTransactionsByCategory(
//   transactions: Transaction[],
//   selectedCategoryName: string,
//   categories: { id: string; name: string }[]
// ): Transaction[] {
//   return transactions.filter((tx) => {
//     const txCategoryName =
//       categories.find((c) => c.id === tx.categoryId)?.name || tx.categoryId;
//     return txCategoryName === selectedCategoryName;
//   });
// }

// export function filterTransactionsByType(
//   transactions: Transaction[],
//   type: "Income" | "Expenses"
// ): Transaction[] {
//   return transactions.filter((tx) => tx.type === type);
// }

//---------

// export function filterTransactionsByCategory(
//   transactions: Transaction[],
//   selectedCategoryName: string,
//   categories: { id: string; name: string }[]
// ): Transaction[] {
//   return transactions.filter((tx) => {
//     // находим категорию транзакции
//     const category = categories.find((c) => String(c.id) === String(tx.categoryId));
//     const txCategoryName = category?.name || "Deleted";

//     // сравниваем с выбранной категорией
//     return txCategoryName === selectedCategoryName;
//   });
// }
