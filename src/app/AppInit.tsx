import { useEffect, ReactNode } from "react";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useUserStore } from "@/entities/user/model/user.store";

export const AppInit = ({ children }: { children: ReactNode }) => {
  const { fetchCategories } = useCategoriesStore();
  const { fetchTransactions } = useTransactionsStore();

  useEffect(() => {
    const initData = async () => {
      const currentUser = useUserStore.getState().user;
      if (!currentUser) return; // не логиним демо здесь!

      await Promise.all([fetchCategories(), fetchTransactions()]);
    };

    initData();
  }, [fetchCategories, fetchTransactions]);

  return <>{children}</>;
};
