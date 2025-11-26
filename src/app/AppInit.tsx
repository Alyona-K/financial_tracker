import { useEffect, ReactNode, useState } from "react";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { useAuthStore } from "@/entities/auth/model/auth.store";

export const AppInit = ({ children }: { children: ReactNode }) => {
  const { fetchCategories } = useCategoriesStore();
  const { fetchTransactions } = useTransactionsStore();
  const currentUser = useUserStore((state) => state.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const authStore = useAuthStore.getState();
      let user = currentUser;

      if ((!authStore.token || !user) && !authStore.skipAutoLogin) {
        user = await authStore.initDemoUser();
      }

      if (!user) {
        console.warn("[AppInit] No user after initDemoUser");
        setReady(true);
        return;
      }

      try {
        await Promise.all([fetchCategories(), fetchTransactions()]);
      } catch (err) {
        console.error("[AppInit] Failed to fetch initial data", err);
      } finally {
        setReady(true);
      }
    };

    initData();
  }, [currentUser, fetchCategories, fetchTransactions]);

  if (!ready) return <div>Loading app data...</div>;

  return <>{children}</>;
};
