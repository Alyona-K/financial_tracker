import { JSX, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { ROUTES } from "@/shared/config/routes";
import Sidebar from "../shared/ui/Sidebar";
import Topbar from "../shared/ui/Topbar";
import { Loader } from "@/shared/ui/Loader";
import AnimatedPage from "../shared/ui/AnimatedPage";
import { AppInit } from "./AppInit";
import "./App.scss";

// --- LAZY PAGES ---
const LazyHomePage = lazy(() => import("../pages/home"));
const LazyNotFoundPage = lazy(() => import("../pages/404"));
const LazyOverviewPage = lazy(() => import("../pages/overview"));
const LazyTransactionsPage = lazy(() => import("../pages/transactions"));
const LazyCategoriesPage = lazy(() => import("../pages/categories"));
const LazyLoginPage = lazy(() => import("../pages/login"));
const LazyRegisterPage = lazy(() => import("../pages/register"));
const LazyUserProfilePage = lazy(() => import("../pages/profile"));

// --- PROTECTED ROUTE ---
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
}

// --- APP ROUTES ---
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

// --- MAIN APP ---
function App() {
  const location = useLocation();
  const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <AppInit>
      <div className="app">
        {!isAuthPage && <Sidebar />}
        <div className="app__content">
          {!isAuthPage && <Topbar />}
          <main>
            <AppRoutes />
          </main>
        </div>
      </div>
    </AppInit>
  );
}

export default App;
