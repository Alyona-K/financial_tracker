// --- MOCKS ---
jest.mock("@/shared/lib/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));
jest.mock("@/entities/transaction/model/transaction.store");
jest.mock("@/entities/user/model/user.store");
jest.mock("@/shared/store/useNotificationsStore");
jest.mock("@/assets/images/sprite.svg", () => "mocked-sprite");
jest.mock("@/shared/ui/DatePickerGlobal.css", () => ({}));

import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsPage from "./index";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";

describe("TransactionsPage", () => {
  const fetchTransactions = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransactionsStore as unknown as jest.Mock).mockReturnValue({
      fetchTransactions,
      transactions: [],
      isLoading: false,
      addTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
    });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: { id: "u1" },
    });
    (useNotificationsStore as unknown as jest.Mock).mockReturnValue({
      setNotificationsCount: jest.fn(),
    });
  });

  test("fetches transactions on mount", () => {
    render(<TransactionsPage />);
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
  });

  test("opens ADD modal", () => {
    render(<TransactionsPage />);
    fireEvent.click(screen.getByRole("button", { name: /Add transaction/i }));
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    (useTransactionsStore as unknown as jest.Mock).mockReturnValue({
      fetchTransactions,
      transactions: [],
      isLoading: true,
      addTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
    });
    render(<TransactionsPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
