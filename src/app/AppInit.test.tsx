// --- MOCKS ---
const mockFetchCategories = jest.fn();
const mockFetchTransactions = jest.fn();
const mockInitDemoUser = jest.fn();

jest.mock("@/entities/category/model/category.store", () => ({
  useCategoriesStore: () => ({
    fetchCategories: mockFetchCategories,
  }),
}));

jest.mock("@/entities/transaction/model/transaction.store", () => ({
  useTransactionsStore: () => ({
    fetchTransactions: mockFetchTransactions,
  }),
}));

jest.mock("@/entities/auth/model/auth.store", () => ({
  useAuthStore: {
    getState: () => ({
      token: null,
      skipAutoLogin: false,
      initDemoUser: mockInitDemoUser,
    }),
  },
}));

let currentUser: any = null;
jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: (selector?: any) =>
    selector
      ? selector({ user: currentUser, setUser: (u: any) => (currentUser = u) })
      : { user: currentUser, setUser: (u: any) => (currentUser = u) },
}));

import { render, screen, waitFor } from "@testing-library/react";
import { AppInit } from "./AppInit";
import { useAuthStore } from "@/entities/auth/model/auth.store";

// --- TESTS ---
describe("<AppInit />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = null;
    mockFetchCategories.mockResolvedValue(undefined);
    mockFetchTransactions.mockResolvedValue(undefined);
    mockInitDemoUser.mockResolvedValue({ id: 1, email: "demo@test.com" });
  });

  it("renders loading spinner initially", async () => {
    const pendingPromise = new Promise(() => {});
    mockInitDemoUser.mockReturnValueOnce(pendingPromise as any);

    render(
      <AppInit>
        <div>Children content</div>
      </AppInit>
    );

    expect(screen.getByText(/Loading app data/i)).toBeInTheDocument();
  });

  it("calls initDemoUser if no token and no user", async () => {
    render(
      <AppInit>
        <div>Children content</div>
      </AppInit>
    );

    await waitFor(() => {
      expect(mockInitDemoUser).toHaveBeenCalled();
      expect(mockFetchCategories).toHaveBeenCalled();
      expect(mockFetchTransactions).toHaveBeenCalled();
      expect(screen.getByText("Children content")).toBeInTheDocument();
    });
  });

  it("does not call initDemoUser if user already exists and token exists", async () => {
    currentUser = { id: 99, email: "already@user.com" };
    (useAuthStore.getState as jest.Mock) = jest.fn(() => ({
      token: "abc123",
      skipAutoLogin: false,
      initDemoUser: mockInitDemoUser,
    }));

    render(
      <AppInit>
        <div>Children content</div>
      </AppInit>
    );

    await waitFor(() => {
      expect(mockInitDemoUser).not.toHaveBeenCalled();
      expect(mockFetchCategories).toHaveBeenCalled();
      expect(mockFetchTransactions).toHaveBeenCalled();
      expect(screen.getByText("Children content")).toBeInTheDocument();
    });
  });

  it("handles fetchCategories / fetchTransactions errors gracefully", async () => {
    mockInitDemoUser.mockResolvedValue({ id: 1 });
    mockFetchCategories.mockRejectedValue(new Error("Categories failed"));
    mockFetchTransactions.mockRejectedValue(new Error("Transactions failed"));

    render(
      <AppInit>
        <div>Children content</div>
      </AppInit>
    );

    await waitFor(() => {
      expect(screen.getByText("Children content")).toBeInTheDocument();
    });
  });

  it("warns if initDemoUser returns null", async () => {
    mockInitDemoUser.mockResolvedValue(null);
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    render(
      <AppInit>
        <div>Children content</div>
      </AppInit>
    );

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[AppInit] No user after initDemoUser"
      );
      expect(screen.getByText("Children content")).toBeInTheDocument();
    });

    consoleWarnSpy.mockRestore();
  });
});
