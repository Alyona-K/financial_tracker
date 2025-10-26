import { useMemo } from "react";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { Transaction } from "@/entities/transaction/model/transaction.types";

export type TransactionWithCategoryName = Transaction & { 
  categoryName: string;
  isDeletedCategory: boolean;
};

export function useTransactionsWithCategoryNames(): TransactionWithCategoryName[] {
  const { transactions } = useTransactionsStore();
  const { categories } = useCategoriesStore();

  return useMemo(() => {
    if (!transactions.length) return [];

    return transactions.map((tx) => {
      const category = categories.find(c => c.id === tx.categoryId);
      return {
        ...tx,
        categoryName: category?.name ?? "Deleted",
        isDeletedCategory: category?.isDeleted ?? !category,
      };
    });
  }, [transactions, categories]);
}

  