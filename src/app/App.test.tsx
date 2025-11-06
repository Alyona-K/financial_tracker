// --- API & CONFIG MOCKS ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

// --- IMAGE MOCKS ---
jest.mock("@/assets/images/fintrack-logo.png", () => "logo-mock", {
  virtual: true,
});
jest.mock("@/assets/images/default_avatar.png", () => "avatar-mock", {
  virtual: true,
});
jest.mock("@/assets/images/home-banner.png", () => "home-banner-mock", {
  virtual: true,
});
jest.mock("@/assets/images/sprite.svg", () => "sprite-mock", { virtual: true });

// --- AUTH STORE MOCK ---
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

const useUserStoreMock: UserStoreMock = jest.fn((selector) =>
  selector(userStore)
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

// --- TEST SETUP ---
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppInit } from "./AppInit";

import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { clearUserData } from "@/shared/lib/clearUserData";

// --- APP TESTS ---
describe("App", () => {
  const user1 = {
    id: 1,
    email: "user1@test.com",
    firstName: "U1",
    lastName: "Test",
    avatar: "",
  };
  const user2 = {
    id: 2,
    email: "user2@test.com",
    firstName: "U2",
    lastName: "Test",
    avatar: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.getState().setUser(null);
    useAuthStore.getState().token = "123";
  });

  it("renders loading spinner initially if not ready and not auth page", async () => {
    const initDemoMock: () => Promise<void> = jest.fn(
      () => new Promise<void>(() => {})
    );
    useAuthStore.getState().initDemoUser = initDemoMock;
    useAuthStore.getState().token = null;

    await act(async () => {
      render(
        <BrowserRouter>
          <AppInit>
            <App />
          </AppInit>
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Loading user/i)).toBeInTheDocument();
  });

  it("calls initDemoUser for non-auth page if no token and no user", async () => {
    const initDemoMock = jest.fn().mockResolvedValue(undefined);
    useAuthStore.getState().initDemoUser = initDemoMock;
    useAuthStore.getState().token = null;
    useUserStore.getState().setUser(null);

    await act(async () => {
      render(
        <BrowserRouter>
          <AppInit>
            <App />
          </AppInit>
        </BrowserRouter>
      );
    });

    await waitFor(() => expect(initDemoMock).toHaveBeenCalled());
  });

  it("renders Sidebar and Topbar for logged-in user", async () => {
    useAuthStore.getState().token = "123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppInit>
            <App />
          </AppInit>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("topbar")).toBeInTheDocument();
    });
  });

  it("does not render Sidebar and Topbar on auth pages", async () => {
    useAuthStore.getState().token = "123";
    useUserStore.getState().setUser({
      id: 1,
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
      avatar: "",
    });

    window.history.pushState({}, "Login page", "/login");

    await act(async () => {
      render(
        <BrowserRouter>
          <AppInit>
            <App />
          </AppInit>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
      expect(screen.queryByTestId("topbar")).not.toBeInTheDocument();
    });
  });

  it("clears user data when switching from one real user to another", async () => {
    useUserStore.getState().setUser({ ...user1 });

    const { rerender } = render(
      <BrowserRouter>
        <AppInit>
          <App />
        </AppInit>
      </BrowserRouter>
    );

    act(() => {
      useUserStore.getState().setUser({ ...user2 });
    });

    rerender(
      <BrowserRouter>
        <AppInit>
          <App />
        </AppInit>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(clearUserData).toHaveBeenCalled();
    });
  });
});
