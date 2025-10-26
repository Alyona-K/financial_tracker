import { JSX, lazy, Suspense, useEffect, useState } from "react";
import { ROUTES } from "@/shared/config/routes";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import Sidebar from "../shared/ui/Sidebar";
import Topbar from "../shared/ui/Topbar";
import AnimatedPage from "../shared/ui/AnimatedPage";
import "./DatePickerGlobal.css";

const LazyHomePage = lazy(() => import("../pages/home"));
const LazyNotFoundPage = lazy(() => import("../pages/404"));
const LazyOverviewPage = lazy(() => import("../pages/overview"));
const LazyTransactionsPage = lazy(() => import("../pages/transactions"));
const LazyCategoriesPage = lazy(() => import("../pages/categories"));
const LazyLoginPage = lazy(() => import("../pages/login"));
const LazyRegisterPage = lazy(() => import("../pages/register"));

import "./App.css";

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDemoUser();
      console.log("Demo user initialized, token:", useAuthStore.getState().token);
      setReady(true);
    })();
  }, []);

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

