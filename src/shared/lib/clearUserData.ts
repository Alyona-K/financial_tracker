import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useWidgetsStore } from "@/entities/widget/model/widget.store";

export const clearUserData = () => {
  useTransactionsStore.getState().clearTransactions();
  useCategoriesStore.getState().clearCategories();
  useWidgetsStore.getState().clearWidgets?.();
};
