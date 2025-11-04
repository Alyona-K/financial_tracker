import { JSX, lazy, Suspense, useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import type { User } from "@/entities/user/model/user.types";
import { clearUserData } from "@/shared/lib/clearUserData";
import { ROUTES } from "@/shared/config/routes";
import Sidebar from "../shared/ui/Sidebar";
import Topbar from "../shared/ui/Topbar";
import { Loader } from "@/shared/ui/Loader";
import AnimatedPage from "../shared/ui/AnimatedPage";
import "./App.scss";

const LazyHomePage = lazy(() => import("../pages/home"));
const LazyNotFoundPage = lazy(() => import("../pages/404"));
const LazyOverviewPage = lazy(() => import("../pages/overview"));
const LazyTransactionsPage = lazy(() => import("../pages/transactions"));
const LazyCategoriesPage = lazy(() => import("../pages/categories"));
const LazyLoginPage = lazy(() => import("../pages/login"));
const LazyRegisterPage = lazy(() => import("../pages/register"));
const LazyUserProfilePage = lazy(() => import("../pages/profile"));

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <div>Loading user...</div>;
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.HOME} element={<LazyHomePage />} />

          <Route
            path={ROUTES.OVERVIEW}
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <LazyOverviewPage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TRANSACTIONS}
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <LazyTransactionsPage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CATEGORIES}
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <LazyCategoriesPage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <LazyUserProfilePage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.LOGIN} element={<LazyLoginPage />} />
          <Route path={ROUTES.REGISTER} element={<LazyRegisterPage />} />
          <Route path={ROUTES.NOTFOUND} element={<LazyNotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  const location = useLocation();
  const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
  const isAuthPage = authRoutes.includes(location.pathname);

  const initDemoUser = useAuthStore((s) => s.initDemoUser);
  const user = useUserStore((s) => s.user);
  const [ready, setReady] = useState(false);

   const prevUser = useRef<User | null>(null);

  const isDemoUser = (u: User | null) => u?.email === "demo@fintrack.com";

  // Очищаем сторы только при смене реального пользователя
  useEffect(() => {
  if (user?.id !== prevUser.current?.id) {
    if (prevUser.current && !isDemoUser(prevUser.current)) {
      clearUserData();
    }

    prevUser.current = user ?? null;

    if (user) {
      const { fetchCategories } = useCategoriesStore.getState();
      const { fetchTransactions } = useTransactionsStore.getState();
      Promise.all([fetchCategories(), fetchTransactions()]);
    }
  }
}, [user]);


  useEffect(() => {
    (async () => {
      if (!isAuthPage) {
        const authStore = useAuthStore.getState();
        const userStore = useUserStore.getState();

        if (!authStore.token && !userStore.user) {
          await initDemoUser(); // логиним демо при старте
        }
      }
      setReady(true);
    })();
  }, [isAuthPage, initDemoUser]);

  if (!ready && !isAuthPage) return <div>Loading user...</div>;

  return (
    <div className="app">
      {!isAuthPage && <Sidebar />}
      <div className="app__content">
        {!isAuthPage && <Topbar />}
        <main>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;

 // const prevUserId = useRef<number | null>(null);
  // useEffect(() => {
  //   if (user?.id !== prevUserId.current) {
  //     if (prevUserId.current !== null && !isDemoUser(user)) {
  //       clearUserData();
  //     }
  //     prevUserId.current = user?.id ?? null;

  //     if (user) {
  //       // после смены — сразу подгружаем новые данные
  //       const { fetchCategories } = useCategoriesStore.getState();
  //       const { fetchTransactions } = useTransactionsStore.getState();
  //       Promise.all([fetchCategories(), fetchTransactions()]);
  //     }
  //   }
  // }, [user]);