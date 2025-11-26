// --- API & CONFIG MOCKS ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

jest.mock("@/app/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

//  GLOBAL ASSET MOCKS
jest.mock("@/assets/images/fintrack-logo.png", () => "logo-mock", {
  virtual: true,
});
jest.mock("@/assets/images/default_avatar.png", () => "avatar-mock", {
  virtual: true,
});
jest.mock("@/assets/images/home-banner.png", () => "home-banner-mock", {
  virtual: true,
});
jest.mock("@/assets/images/profile-banner.png", () => "profile-banner-mock", {
  virtual: true,
});
jest.mock("@/assets/images/404.png", () => "not-found-mock", { virtual: true });
jest.mock("@/shared/ui/DatePickerGlobal.css", () => ({}));

jest.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: ({ children }: any) => <div>{children}</div>,
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    CartesianGrid: () => <div />,
  };
});

jest.mock("@/pages/overview/ui/AnalyticsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="analytics-mock">AnalyticsSection Mock</div>,
}));

//  ZUSTAND STORE MOCKS (AUTH / USER / CATEGORY / TX)

// Auth store mock
const authStoreState = {
  token: null,
  isLoading: false,
  error: null,
  skipAutoLogin: false,
  initDemoUser: jest.fn().mockResolvedValue(undefined),
  login: jest.fn().mockResolvedValue(undefined),
  register: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn(),
  refreshToken: jest.fn().mockResolvedValue(undefined),
};

const useAuthStoreMock = jest.fn((selector) => selector(authStoreState)) as any;
useAuthStoreMock.getState = () => authStoreState;

jest.mock("@/entities/auth/model/auth.store", () => ({
  useAuthStore: useAuthStoreMock,
}));

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

// --- USER STORE MOCK ---
let currentUser: User | null = null;
const listeners: (() => void)[] = [];

const userStore = {
  get user(): User | null {
    return currentUser;
  },
  fetchUser: jest.fn().mockResolvedValue(undefined),
  updateUser: jest.fn().mockResolvedValue(undefined),
  setUser: jest.fn((newUser: User) => {
    currentUser = newUser;
    listeners.forEach((fn) => fn());
  }),
};

interface UserStoreMock extends jest.Mock {
  getState: () => typeof userStore;
  subscribe: (fn: () => void) => () => void;
}

const useUserStoreMock: UserStoreMock = jest.fn((selector?: any) =>
  selector ? selector(userStore) : userStore
) as any;
useUserStoreMock.getState = () => userStore;
useUserStoreMock.subscribe = (fn: () => void) => {
  listeners.push(fn);
  return () => {};
};

jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: useUserStoreMock,
}));

// --- CATEGORIES STORE MOCK ---
const categoriesStore = {
  categories: [],
  isLoading: false,
  fetchCategories: jest.fn().mockResolvedValue(undefined),
  addCategory: jest.fn().mockResolvedValue(undefined),
  updateCategory: jest.fn().mockResolvedValue(undefined),
  deleteCategory: jest.fn().mockResolvedValue(undefined),
  clearCategories: jest.fn(),
};

const useCategoriesStoreMock = () => categoriesStore;
(useCategoriesStoreMock as any).getState = () => categoriesStore;

jest.mock("@/entities/category/model/category.store", () => ({
  useCategoriesStore: useCategoriesStoreMock,
}));

// --- TRANSACTIONS STORE MOCK ---
const transactionsStore = {
  transactions: [],
  isLoading: false,
  fetchTransactions: jest.fn().mockResolvedValue(undefined),
  addTransaction: jest.fn().mockResolvedValue(undefined),
  updateTransaction: jest.fn().mockResolvedValue(undefined),
  deleteTransaction: jest.fn().mockResolvedValue(undefined),
  clearTransactions: jest.fn(),
};

const useTransactionsStoreMock = () => transactionsStore;
(useTransactionsStoreMock as any).getState = () => transactionsStore;

jest.mock("@/entities/transaction/model/transaction.store", () => ({
  useTransactionsStore: useTransactionsStoreMock,
}));

// --- CLEAR USER DATA MOCK ---
jest.mock("@/shared/lib/clearUserData", () => ({
  clearUserData: jest.fn(),
}));

import React, { Suspense } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import App from "./App";
import { AppInit } from "./AppInit";
import { Providers } from "@/app/Providers";

import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";

// --- HELPERS ---
export const renderWithRouter = async (path: string) => {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );
  });
  return result;
};

export const renderWithRouterAndInit = async (path: string) => {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={[path]}>
        <Providers>
          <AppInit>
            <App />
          </AppInit>
        </Providers>
      </MemoryRouter>
    );
  });
  return result;
};

// --- TESTS ---
describe("<App />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().token = null;
    currentUser = null;
  });

  // Loader / AppInit
  it("renders page loader when lazy page is loading", async () => {
    const LazyHomePage = React.lazy(() => new Promise(() => {}));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Suspense
            fallback={<div data-testid="page-loader">Loading page…</div>}
          >
            <LazyHomePage />
          </Suspense>
        </MemoryRouter>
      );
    });
    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
  });

  it("renders page content after AppInit completes", async () => {
    const initDemoMock: () => Promise<User | null> = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        email: "demo@test.com",
        firstName: "Demo",
        lastName: "User",
        avatar: "",
      });
    useAuthStore.getState().initDemoUser = initDemoMock;
    useAuthStore.getState().token = "abc123";

    await renderWithRouterAndInit("/overview");

    await waitFor(() => {
      expect(screen.getByTestId("analytics-mock")).toBeInTheDocument();
      expect(categoriesStore.fetchCategories).toHaveBeenCalled();
    });
  });

  // Auth pages layout
  it("does not render Sidebar/Topbar on /login", async () => {
    useAuthStore.getState().token = "abc123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await renderWithRouter("/login");

    await waitFor(() => {
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("topbar")).not.toBeInTheDocument();
    });
  });

  it("does not render Sidebar/Topbar on /register", async () => {
    useAuthStore.getState().token = "abc123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await renderWithRouter("/register");

    await waitFor(() => {
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("topbar")).not.toBeInTheDocument();
    });
  });

  // Protected routes
  it("redirects from protected route to /login when user is not authenticated", async () => {
    const initDemoMock: () => Promise<User | null> = jest.fn(() =>
      Promise.resolve(null)
    );
    useAuthStore.getState().initDemoUser = initDemoMock;
    useAuthStore.getState().token = null;

    await renderWithRouterAndInit("/overview");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /sign in to your account/i })
      ).toBeInTheDocument();
    });
  });

  it("renders protected route when token exists", async () => {
    useAuthStore.getState().token = "abc123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await renderWithRouter("/overview");

    await waitFor(() => {
      expect(categoriesStore.fetchCategories).toHaveBeenCalled();
      expect(screen.getByText(/overview/i)).toBeInTheDocument();
    });
  });

  const protectedRoutes = ["/transactions", "/categories", "/profile"];
  protectedRoutes.forEach((route) => {
    it(`renders protected route ${route} when token exists`, async () => {
      useAuthStore.getState().token = "abc123";
      useUserStore.getState().setUser({
        id: 1,
        email: "user@test.com",
        firstName: "Test",
        lastName: "User",
        avatar: "",
      });

      await renderWithRouter(route);

      await waitFor(() => {
        switch (route) {
          case "/transactions":
            expect(
              screen.getByRole("heading", { name: /transactions/i })
            ).toBeInTheDocument();
            break;
          case "/categories":
            expect(
              screen.getByRole("heading", { name: /categories/i })
            ).toBeInTheDocument();
            break;
          case "/profile":
            expect(screen.getByTestId("profile-page")).toBeInTheDocument();
            break;
        }
      });
    });
  });

  // Layout
  it("renders Sidebar and Topbar on main layout when authenticated", async () => {
    useAuthStore.getState().token = "abc123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await renderWithRouter("/");

    await waitFor(() => {
      expect(categoriesStore.fetchCategories).toHaveBeenCalled();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("topbar")).toBeInTheDocument();
    });
  });

  // 404 page
  it("renders 404 page for unknown route", async () => {
    useAuthStore.getState().token = "abc123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await renderWithRouter("/some-random-unknown-route");

    await waitFor(() => {
      expect(
        screen.getByRole("main").querySelector(".not-found-page")
      ).toBeInTheDocument();
    });
  });
});
