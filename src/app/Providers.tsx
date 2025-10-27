import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "@/app/ErrorBoundary";

type ProvidersProps = { children: ReactNode };

export const Providers = ({ children }: ProvidersProps) => {
  const basename = import.meta.env.VITE_BASENAME || "/";

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>{children}</BrowserRouter>
    </ErrorBoundary>
  );
};



// import { ReactNode, useEffect } from "react";
// import { BrowserRouter } from "react-router-dom";
// import ErrorBoundary from "@/app/ErrorBoundary";
// import { useAuthStore } from "@/entities/auth/model/auth.store";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";

// type ProvidersProps = { children: ReactNode };

// export const Providers = ({ children }: ProvidersProps) => {
//   const initDemoUser = useAuthStore((s) => s.initDemoUser);
//   const isInitialized = useAuthStore((s) => s.isInitialized);

//   useEffect(() => {
//     if (typeof window === "undefined") return; // защищаем SSR

//     (async () => {
//       await initDemoUser();

//       // после того как токен точно есть
//       const { fetchTransactions } = useTransactionsStore.getState();
//       await fetchTransactions();
//     })();
//   }, [initDemoUser]);

//   const basename = import.meta.env.VITE_BASENAME || "/";

//   if (!isInitialized) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         Loading demo user...
//       </div>
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <BrowserRouter basename={basename}>{children}</BrowserRouter>
//     </ErrorBoundary>
//   );
// };
