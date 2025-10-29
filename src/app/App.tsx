import { JSX, lazy, Suspense, useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { clearUserData } from "@/shared/lib/clearUserData"; 
import { ROUTES } from "@/shared/config/routes";
import Sidebar from "../shared/ui/Sidebar";
import Topbar from "../shared/ui/Topbar";
import AnimatedPage from "../shared/ui/AnimatedPage";
import "./DatePickerGlobal.css";
import "./App.css";

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
    <Suspense fallback={<div>Loading page...</div>}>
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

  const prevUserId = useRef<number | null>(null);

  // очищаем сторы только при смене юзера
  useEffect(() => {
    if (user?.id !== prevUserId.current) {
      if (prevUserId.current !== null) {
        clearUserData();
      }
      prevUserId.current = user?.id ?? null;
    }
  }, [user]);

  // инициализация демо пользователя
  useEffect(() => {
    (async () => {
      if (!isAuthPage) {
        // если юзер не залогинен вручную
        const { user } = useUserStore.getState();
        if (!user) {
          await initDemoUser(); // только тогда логин демо
        }
        setReady(true);
      } else {
        setReady(true);
      }
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

