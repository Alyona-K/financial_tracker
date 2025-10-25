import React, { useState, useMemo, useEffect } from "react";
import { Transaction } from "@/entities/transaction/model/transaction.types";
import {
  useTransactionsWithCategoryNames,
  TransactionWithCategoryName,
} from "@/entities/transaction/lib/useTransactionsWithCategoryNames";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import Button from "@/shared/ui/Button";
import { parseDate } from "@/shared/lib/parseDate";
import TransactionRow from "@/entities/transaction/ui/TransactionRow";
import TransactionsTableHeader from "@/entities/transaction/ui/TransactionsTableHeader";
import {
  sortTransactions,
  filterTransactionsByCategory,
  filterTransactionsByType,
} from "@/shared/lib/transactions";
import "./TransactionsTable.css";

type TransactionsTableProps = {
  searchQuery: string;
  dateRange?: { start: Date | null; end: Date | null };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  searchQuery,
  dateRange,
  onEdit,
  onDelete,
}) => {
  const transactions: TransactionWithCategoryName[] =
    useTransactionsWithCategoryNames();
  const { categories, fetchCategories } = useCategoriesStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [sortConfig, setSortConfig] = useState<{
    field: keyof Transaction;
    direction: "asc" | "desc";
    filteredType?: "Income" | "Expenses";
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"Income" | "Expenses" | "">(
    ""
  );

  const [visibleCount, setVisibleCount] = useState(12);

  // Сбрасываем пагинацию при изменении фильтров или поиска
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, dateRange, selectedCategory, selectedType]);

  const sortedTransactions = useMemo(() => {
    // если нет sortConfig, сортируем по дате по умолчанию (desc)
    const field = sortConfig?.field || "date";
    const direction = sortConfig?.direction || "desc";
    return sortTransactions(transactions, field, direction);
  }, [transactions, sortConfig]);

  const visibleTransactions = useMemo(() => {
    let temp = [...sortedTransactions];

    if (selectedCategory)
      temp = filterTransactionsByCategory(temp, selectedCategory, categories);
    if (selectedType) temp = filterTransactionsByType(temp, selectedType);

    const normalizeDate = (d: Date | null) =>
      d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;

    if (dateRange?.start || dateRange?.end) {
      const start = normalizeDate(dateRange.start);
      const end = normalizeDate(dateRange.end);
      const adjustedEnd = end
        ? new Date(end.getTime() + 24 * 60 * 60 * 1000)
        : null;

      temp = temp.filter((t) => {
        const parsedDate = parseDate(t.date);
        if (!parsedDate) return false;

        const txDate = normalizeDate(parsedDate);
        if (!txDate) return false;

        if (start && txDate < start) return false;
        if (adjustedEnd && txDate >= adjustedEnd) return false;

        return true;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      temp = temp.filter((t) =>
        [
          t.description,
          t.categoryName,
          t.type,
          t.amount.toString(),
          t.date,
        ].some((field) => field.toString().toLowerCase().includes(query))
      );
    }

    return temp;
  }, [
    sortedTransactions,
    selectedCategory,
    selectedType,
    searchQuery,
    dateRange,
  ]);

  const handleSort = (field: keyof Transaction, direction: "asc" | "desc") => {
    setSortConfig({
      field,
      direction,
      filteredType: selectedType || undefined,
    });
  };

  const handleFilterCategory = (category: string) =>
    setSelectedCategory(category);

  const handleFilterType = (type?: "Income" | "Expenses") =>
    setSelectedType(type || "");

  return (
    <div className="transactions-table">
      <TransactionsTableHeader
        onSort={handleSort}
        onFilterCategory={handleFilterCategory}
        onFilterType={handleFilterType}
        categories={categories.map((c) => c.name)}
      />
      <div className="transactions-table__body">
        {visibleTransactions.length > 0 ? (
          <>
            {visibleTransactions.slice(0, visibleCount).map((tx) => (
              <TransactionRow
                key={tx.id}
                date={tx.date}
                description={tx.description}
                // categoryId={tx.categoryId}
                categoryName={tx.categoryName}
                type={tx.type}
                amount={tx.amount}
                searchQuery={searchQuery}
                onEdit={() => onEdit?.(tx.id)}
                onDelete={() => onDelete?.(tx.id)}
              />
            ))}

            {visibleCount < visibleTransactions.length && (
              <div className="transactions-table__load-more">
                <Button
                  className="transactions-table__more btn btn--large"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="transactions-table__empty">No transactions found</div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;

//-----------

// import React, { useState, useMemo, useEffect } from "react";
// import { Transaction } from "@/entities/transaction/model/transaction.types";
// import {
//   useTransactionsStore,
//   TransactionWithCategoryName,
// } from "@/entities/transaction/model/transaction.store";
// import { useCategoriesStore } from "@/entities/category/model/category.store";
// import Button from "@/shared/ui/Button";
// import { parseDate } from "@/shared/lib/parseDate";
// import TransactionRow from "@/entities/transaction/ui/TransactionRow";
// import TransactionsTableHeader from "@/entities/transaction/ui/TransactionsTableHeader";
// import {
//   sortTransactions,
//   filterTransactionsByType,
// } from "@/shared/lib/transactions";
// import "./TransactionsTable.css";

// type TransactionsTableProps = {
//   searchQuery: string;
//   dateRange?: { start: Date | null; end: Date | null };
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// };

// const TransactionsTable: React.FC<TransactionsTableProps> = ({
//   searchQuery,
//   dateRange,
//   onEdit,
//   onDelete,
// }) => {
//   // const { getTransactionsWithCategoryNames } = useTransactionsStore();
//   const { categories, fetchCategories } = useCategoriesStore();

//   const [sortConfig, setSortConfig] = useState<{
//     field: keyof Transaction;
//     direction: "asc" | "desc";
//     filteredType?: "Income" | "Expenses";
//   } | null>(null);

//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedType, setSelectedType] = useState<"Income" | "Expenses" | "">(
//     ""
//   );
//   const [visibleCount, setVisibleCount] = useState(12);

//   // Подгружаем категории
//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   // Все транзакции с categoryName, берём напрямую из стора
//   const transactions = useTransactionsStore((state) =>
//     state.getTransactionsWithCategoryNames()
//   );

//   // Сброс видимого количества при фильтрах/поиске
//   useEffect(() => {
//     setVisibleCount(12);
//   }, [searchQuery, dateRange, selectedCategory, selectedType]);

//   // Сортировка
//   const sortedTransactions = useMemo(() => {
//     if (!sortConfig) return [...transactions];

//     const { field, direction } = sortConfig;

//     return [...transactions].sort((a, b) => {
//       let valA = a[field];
//       let valB = b[field];

//       // Для даты или суммы приводим к числу
//       if (field === "date") {
//         valA = new Date(a.date).getTime();
//         valB = new Date(b.date).getTime();
//       }
//       if (field === "amount") {
//         valA = a.type === "Income" ? a.amount : -a.amount;
//         valB = b.type === "Income" ? b.amount : -b.amount;
//       }

//       // Сравнение чисел
//       if (typeof valA === "number" && typeof valB === "number") {
//         return direction === "asc" ? valA - valB : valB - valA;
//       }

//       // Для строк приводим к lowerCase
//       valA = String(valA).toLowerCase();
//       valB = String(valB).toLowerCase();

//       if (valA < valB) return direction === "asc" ? -1 : 1;
//       if (valA > valB) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [transactions, sortConfig]);

//   // Видимые транзакции после фильтров и поиска
//   const visibleTransactions = useMemo<TransactionWithCategoryName[]>(() => {
//     let temp: TransactionWithCategoryName[] = [...sortedTransactions];

//     // Фильтр по категории
//     if (selectedCategory) {
//       temp = temp.filter((t) =>
//         selectedCategory === "Deleted"
//           ? t.categoryId === "deleted"
//           : t.categoryName === selectedCategory
//       );
//     }

//     // Фильтр по типу
//     if (selectedType) {
//       temp = filterTransactionsByType(
//         temp,
//         selectedType
//       ) as TransactionWithCategoryName[];
//     }

//     // Фильтр по дате
//     if (dateRange?.start || dateRange?.end) {
//       const normalizeDate = (d: Date | null) =>
//         d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
//       const start = normalizeDate(dateRange.start);
//       const end = normalizeDate(dateRange.end);
//       const adjustedEnd = end
//         ? new Date(end.getTime() + 24 * 60 * 60 * 1000)
//         : null;

//       temp = temp.filter((t) => {
//         const parsedDate = parseDate(t.date);
//         if (!parsedDate) return false;
//         const txDate = normalizeDate(parsedDate);
//         if (!txDate) return false;
//         if (start && txDate < start) return false;
//         if (adjustedEnd && txDate >= adjustedEnd) return false;
//         return true;
//       });
//     }

//     // Поиск
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       temp = temp.filter((t) =>
//         [
//           t.description,
//           t.categoryName.toLowerCase(),
//           t.type.toLowerCase(),
//           t.amount.toString(),
//           t.date,
//         ].some((field) => field.toString().toLowerCase().includes(query))
//       );
//     }

//     return temp;
//   }, [
//     sortedTransactions,
//     selectedCategory,
//     selectedType,
//     searchQuery,
//     dateRange,
//   ]);

//   const handleSort = (field: keyof Transaction, direction: "asc" | "desc") => {
//     setSortConfig({
//       field,
//       direction,
//       filteredType: selectedType || undefined,
//     });
//   };

//   const handleFilterCategory = (category: string) =>
//     setSelectedCategory(category);
//   const handleFilterType = (type?: "Income" | "Expenses") =>
//     setSelectedType(type || "");

//   return (
//     <div className="transactions-table">
//       <TransactionsTableHeader
//         onSort={handleSort}
//         onFilterCategory={handleFilterCategory}
//         onFilterType={handleFilterType}
//         categories={["Deleted", ...categories.map((c) => c.name)]}
//       />
//       <div className="transactions-table__body">
//         {visibleTransactions.length > 0 ? (
//           <>
//             {visibleTransactions.slice(0, visibleCount).map((tx) => (
//               <TransactionRow
//                 key={tx.id}
//                 date={tx.date}
//                 description={tx.description}
//                 categoryId={tx.categoryId}
//                 type={tx.type}
//                 amount={tx.amount}
//                 searchQuery={searchQuery}
//                 onEdit={() => onEdit?.(tx.id)}
//                 onDelete={() => onDelete?.(tx.id)}
//               />
//             ))}
//             {visibleCount < visibleTransactions.length && (
//               <div className="transactions-table__load-more">
//                 <Button
//                   className="transactions-table__more btn btn--large"
//                   onClick={() => setVisibleCount((prev) => prev + 12)}
//                 >
//                   Load more
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="transactions-table__empty">No transactions found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransactionsTable;

//----------------
// первый вариант

// import React, { useState, useMemo, useEffect } from "react";
// import { Transaction } from "@/entities/transaction/model/transaction.types";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
// import { useCategoriesStore } from "@/entities/category/model/category.store";
// import Button from "@/shared/ui/Button";
// import { parseDate } from "@/shared/lib/parseDate";
// import TransactionRow from "@/entities/transaction/ui/TransactionRow";
// import TransactionsTableHeader from "@/entities/transaction/ui/TransactionsTableHeader";
// import {
//   sortTransactions,
//   filterTransactionsByCategory,
//   filterTransactionsByType,
// } from "@/shared/lib/transactions";
// import "./TransactionsTable.css";

// type TransactionsTableProps = {
//   searchQuery: string;
//   dateRange?: { start: Date | null; end: Date | null };
//   onEdit?: (id: string) => void;
//   onDelete?: (id: string) => void;
// };

// const TransactionsTable: React.FC<TransactionsTableProps> = ({
//   searchQuery,
//   dateRange,
//   onEdit,
//   onDelete,
// }) => {
//   const { transactions } = useTransactionsStore();
//   const { categories, fetchCategories } = useCategoriesStore();
//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const [sortConfig, setSortConfig] = useState<{
//     field: keyof Transaction;
//     direction: "asc" | "desc";
//     filteredType?: "Income" | "Expenses";
//   } | null>(null);

//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedType, setSelectedType] = useState<"Income" | "Expenses" | "">(
//     ""
//   );

//   const [visibleCount, setVisibleCount] = useState(12);

//   // Сбрасываем пагинацию при изменении фильтров или поиска
//   useEffect(() => {
//     setVisibleCount(12);
//   }, [searchQuery, dateRange, selectedCategory, selectedType]);

//   const sortedTransactions = useMemo(() => {
//     // если нет sortConfig, сортируем по дате по умолчанию (desc)
//     const field = sortConfig?.field || "date";
//     const direction = sortConfig?.direction || "desc";
//     return sortTransactions(transactions, field, direction);
//   }, [transactions, sortConfig]);

//   const visibleTransactions = useMemo(() => {
//     let temp = [...sortedTransactions];

//     if (selectedCategory)
//       temp = filterTransactionsByCategory(temp, selectedCategory, categories);
//     if (selectedType) temp = filterTransactionsByType(temp, selectedType);

//     const normalizeDate = (d: Date | null) =>
//       d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;

//     if (dateRange?.start || dateRange?.end) {
//       const start = normalizeDate(dateRange.start);
//       const end = normalizeDate(dateRange.end);
//       const adjustedEnd = end
//         ? new Date(end.getTime() + 24 * 60 * 60 * 1000)
//         : null;

//       temp = temp.filter((t) => {
//         const parsedDate = parseDate(t.date);
//         if (!parsedDate) return false;

//         const txDate = normalizeDate(parsedDate);
//         if (!txDate) return false;

//         if (start && txDate < start) return false;
//         if (adjustedEnd && txDate >= adjustedEnd) return false;

//         return true;
//       });
//     }

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       temp = temp.filter((t) =>
//         [t.description, t.categoryId, t.type, t.amount.toString(), t.date].some(
//           (field) => field.toString().toLowerCase().includes(query)
//         )
//       );
//     }

//     return temp;
//   }, [
//     sortedTransactions,
//     selectedCategory,
//     selectedType,
//     searchQuery,
//     dateRange,
//   ]);

//   const handleSort = (field: keyof Transaction, direction: "asc" | "desc") => {
//     setSortConfig({
//       field,
//       direction,
//       filteredType: selectedType || undefined,
//     });
//   };

//   const handleFilterCategory = (category: string) =>
//     setSelectedCategory(category);

//   const handleFilterType = (type?: "Income" | "Expenses") =>
//     setSelectedType(type || "");

//   return (
//     <div className="transactions-table">
//       <TransactionsTableHeader
//         onSort={handleSort}
//         onFilterCategory={handleFilterCategory}
//         onFilterType={handleFilterType}
//         categories={categories.map((c) => c.name)}
//       />
//       <div className="transactions-table__body">
//         {visibleTransactions.length > 0 ? (
//           <>
//             {visibleTransactions.slice(0, visibleCount).map((tx) => (
//               <TransactionRow
//                 key={tx.id}
//                 date={tx.date}
//                 description={tx.description}
//                 categoryId={tx.categoryId}
//                 type={tx.type}
//                 amount={tx.amount}
//                 searchQuery={searchQuery}
//                 onEdit={() => onEdit?.(tx.id)}
//                 onDelete={() => onDelete?.(tx.id)}
//               />
//             ))}

//             {visibleCount < visibleTransactions.length && (
//               <div className="transactions-table__load-more">
//                 <Button
//                   className="transactions-table__more btn btn--large"
//                   onClick={() => setVisibleCount((prev) => prev + 12)}
//                 >
//                   Load more
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="transactions-table__empty">No transactions found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TransactionsTable;
