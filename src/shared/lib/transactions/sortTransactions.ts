import { Transaction } from "@/entities/transaction/model/transaction.types";

// Универсальная функция сортировки, сохраняющая тип
export function sortTransactions<T extends Transaction>(
  transactions: T[],
  field: keyof Transaction,
  direction: "asc" | "desc",
  categories?: { id: string; name: string }[]
): T[] {
  return [...transactions].sort((a, b) => {
    if (field === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (field === "amount") {
      const amountA = a.type === "Income" ? a.amount : -a.amount;
      const amountB = b.type === "Income" ? b.amount : -b.amount;
      return direction === "asc" ? amountA - amountB : amountB - amountA;
    }

    let valA = String(a[field]).toLowerCase();
    let valB = String(b[field]).toLowerCase();

    if (field === "categoryId" && categories) {
      valA =
        categories.find((c) => String(c.id) === String(a.categoryId))?.name.toLowerCase() ||
        "deleted";
      valB =
        categories.find((c) => String(c.id) === String(b.categoryId))?.name.toLowerCase() ||
        "deleted";
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

//---------

// import { Transaction } from "@/entities/transaction/model/transaction.types";

// export function sortTransactions(
//   transactions: Transaction[],
//   field: keyof Transaction,
//   direction: "asc" | "desc",
//   categories?: { id: string; name: string }[]
// ): Transaction[] {
//   return [...transactions].sort((a, b) => {
//     if (field === "date") {
//       const dateA = new Date(a.date).getTime();
//       const dateB = new Date(b.date).getTime();
//       return direction === "asc" ? dateA - dateB : dateB - dateA;
//     }

//     if (field === "amount") {
//       const amountA = a.type === "Income" ? a.amount : -a.amount;
//       const amountB = b.type === "Income" ? b.amount : -b.amount;
//       return direction === "asc" ? amountA - amountB : amountB - amountA;
//     }

//     // Строковые поля
//     let valA = String(a[field]).toLowerCase();
//     let valB = String(b[field]).toLowerCase();

//     // Если сортируем по categoryId, используем имя категории
//     if (field === "categoryId" && categories) {
//       valA =
//         categories
//           .find((c) => String(c.id) === String(a.categoryId))
//           ?.name.toLowerCase() || "deleted";
//       valB =
//         categories
//           .find((c) => String(c.id) === String(b.categoryId))
//           ?.name.toLowerCase() || "deleted";
//     }

//     if (valA < valB) return direction === "asc" ? -1 : 1;
//     if (valA > valB) return direction === "asc" ? 1 : -1;
//     return 0;
//   });
// }



    // if (field === "categoryId" && categories) {
    //   valA = categories.find(c => c.id === a.categoryId)?.name.toLowerCase() || valA;
    //   valB = categories.find(c => c.id === b.categoryId)?.name.toLowerCase() || valB;
    // }
