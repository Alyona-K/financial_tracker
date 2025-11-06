// --- MOCK API AND CONFIG ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

// --- MOCK STORE FOR TESTING ---
const fetchTransactionsMock = jest.fn();

const transactionsMock = [
  { id: 1, type: "Income", amount: 100, date: "2025-11-01" },
  { id: 2, type: "Expenses", amount: 50, date: "2025-11-02" },
];

jest.mock("@/entities/transaction/model/transaction.store", () => {
  return {
    useTransactionsStore: jest.fn(() => ({
      transactions: [],
      isLoading: false,
      fetchTransactions: fetchTransactionsMock,
      addTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
      clearTransactions: jest.fn(),
    })),
  };
});

import { renderHook } from "@testing-library/react";
import { useWidgetsData, defaultWidgets } from "./useWidgetsData";

describe("useWidgetsData", () => {
  it("should initialize with default widgets", () => {
    const { result } = renderHook(() => useWidgetsData());
    expect(result.current.widgets).toEqual(defaultWidgets);
    expect(fetchTransactionsMock).toHaveBeenCalled();
  });

  // --- CALCULATION TEST ---
  it("should calculate widgets correctly when transactions are set", () => {
    const {
      useTransactionsStore,
    } = require("@/entities/transaction/model/transaction.store");
    useTransactionsStore.mockReturnValue({
      transactions: transactionsMock,
      isLoading: false,
      fetchTransactions: fetchTransactionsMock,
      addTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
      clearTransactions: jest.fn(),
    });

    const { result } = renderHook(() => useWidgetsData());

    const incomeWidget = result.current.widgets.find((w) => w.id === "income");
    const expensesWidget = result.current.widgets.find(
      (w) => w.id === "expenses"
    );
    const balanceWidget = result.current.widgets.find(
      (w) => w.id === "balance"
    );

    expect(incomeWidget?.amount).toBe(100);
    expect(expensesWidget?.amount).toBe(50);
    expect(balanceWidget?.amount).toBe(50);
  });
});
