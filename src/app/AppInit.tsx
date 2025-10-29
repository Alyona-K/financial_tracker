import { useEffect, ReactNode } from "react";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";

export const AppInit = ({ children }: { children: ReactNode }) => {
  const { fetchCategories } = useCategoriesStore();
  const { fetchTransactions } = useTransactionsStore();
  const user = useUserStore((s) => s.user);
  const initDemoUser = useAuthStore((s) => s.initDemoUser);

  useEffect(() => {
    const initData = async () => {
      // ждём, пока есть юзер (демо или залогиненный)
      if (!user) {
        await initDemoUser();
      }
      // когда user есть, фетчим данные
      await Promise.all([fetchCategories(), fetchTransactions()]);
    };

    initData();
  }, [user, fetchCategories, fetchTransactions, initDemoUser]);

  return <>{children}</>;
};