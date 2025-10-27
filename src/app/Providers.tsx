import { ReactNode, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "@/app/ErrorBoundary";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";

type ProvidersProps = { children: ReactNode };

export const Providers = ({ children }: ProvidersProps) => {
  const initDemoUser = useAuthStore((s) => s.initDemoUser);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    (async () => {
      // 1. Залогинить демо-пользователя
      await initDemoUser();

      // 2. Получить store транзакций
      const { fetchTransactions } = useTransactionsStore.getState();

      // 3. Вызвать fetchTransactions после того, как токен точно есть
      await fetchTransactions();
    })();
  }, [initDemoUser]);

  const basename = import.meta.env.VITE_BASENAME || "/";

  if (!isInitialized) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading demo user...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>{children}</BrowserRouter>
    </ErrorBoundary>
  );
};
