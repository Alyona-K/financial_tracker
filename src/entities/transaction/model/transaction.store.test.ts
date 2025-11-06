// --- MOCK API AND CONFIG ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

// --- MOCK USER STORE ---
jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: {
    getState: () => ({
      user: {
        id: 1,
        email: "user@test.com",
        firstName: "Test",
        lastName: "User",
        avatar: "",
      },
      setUser: jest.fn(),
    }),
  },
}));

jest.mock("./transaction.api");

import { act } from "@testing-library/react";
import { useTransactionsStore } from "./transaction.store";
import { Transaction } from "./transaction.types";
import {
  getTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi,
} from "./transaction.api";

describe("Transactions Store", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      amount: 100,
      categoryId: "a",
      date: "2025-11-01",
      type: "Income",
      description: "Salary",
      userId: 1,
    },
    {
      id: "2",
      amount: 50,
      categoryId: "b",
      date: "2025-11-02",
      type: "Expenses",
      description: "Groceries",
      userId: 1,
    },
    {
      id: "3",
      amount: 30,
      categoryId: "c",
      date: "2025-11-03",
      type: "Income",
      description: "Other",
      userId: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useTransactionsStore.setState({ transactions: [], isLoading: false });
  });

  // --- FETCH TRANSACTIONS ---
  it("should fetch transactions for current user", async () => {
    (getTransactions as jest.Mock).mockResolvedValue(mockTransactions);

    await act(async () => {
      await useTransactionsStore.getState().fetchTransactions();
    });

    const state = useTransactionsStore.getState();
    expect(getTransactions).toHaveBeenCalled();
    expect(state.transactions).toHaveLength(2);
    expect(state.transactions[0].id).toBe("1");
    expect(state.transactions[1].id).toBe("2");
    expect(state.isLoading).toBe(false);
  });

  // --- ADD TRANSACTION ---
  it("should add a new transaction", async () => {
    const newTx: Transaction = {
      id: "4",
      amount: 200,
      categoryId: "a",
      date: "2025-11-04",
      type: "Income",
      description: "Bonus",
      userId: 1,
    };
    (createTransaction as jest.Mock).mockResolvedValue(newTx);

    let created: Transaction | undefined;
    await act(async () => {
      created = await useTransactionsStore.getState().addTransaction({
        amount: 200,
        categoryId: "a",
        date: "2025-11-04",
        type: "Income",
        description: "Bonus",
        userId: 1,
      });
    });

    const state = useTransactionsStore.getState();
    expect(createTransaction).toHaveBeenCalledWith({
      amount: 200,
      categoryId: "a",
      date: "2025-11-04",
      type: "Income",
      description: "Bonus",
      userId: 1,
    });
    expect(state.transactions[0]).toEqual(newTx);
    expect(state.isLoading).toBe(false);
    expect(created).toEqual(newTx);
  });

  // --- UPDATE TRANSACTION ---
  it("should update an existing transaction", async () => {
    useTransactionsStore.setState({
      transactions: [
        {
          id: "1",
          amount: 100,
          categoryId: "a",
          date: "2025-11-01",
          type: "Income",
          description: "Salary",
          userId: 1,
        },
      ],
    });

    const updatedTx: Transaction = {
      id: "1",
      amount: 150,
      categoryId: "a",
      date: "2025-11-01",
      type: "Income",
      description: "Salary Updated",
      userId: 1,
    };
    (updateTransactionApi as jest.Mock).mockResolvedValue(updatedTx);

    let saved: Transaction | undefined;
    await act(async () => {
      saved = await useTransactionsStore
        .getState()
        .updateTransaction(updatedTx);
    });

    const state = useTransactionsStore.getState();
    expect(updateTransactionApi).toHaveBeenCalledWith(updatedTx);
    expect(state.transactions[0].amount).toBe(150);
    expect(state.transactions[0].description).toBe("Salary Updated");
    expect(state.isLoading).toBe(false);
    expect(saved).toEqual(updatedTx);
  });

  // --- DELETE TRANSACTION ---
  it("should delete a transaction by id", async () => {
    useTransactionsStore.setState({
      transactions: [
        {
          id: "1",
          amount: 100,
          categoryId: "a",
          date: "2025-11-01",
          type: "Income",
          description: "Salary",
          userId: 1,
        },
        {
          id: "2",
          amount: 50,
          categoryId: "b",
          date: "2025-11-02",
          type: "Expenses",
          description: "Groceries",
          userId: 1,
        },
      ],
    });

    (deleteTransactionApi as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await useTransactionsStore.getState().deleteTransaction("1");
    });

    const state = useTransactionsStore.getState();
    expect(deleteTransactionApi).toHaveBeenCalledWith("1");
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0].id).toBe("2");
    expect(state.isLoading).toBe(false);
  });

  // --- CLEAR TRANSACTIONS ---
  it("should clear transactions", () => {
    useTransactionsStore.setState({
      transactions: [
        {
          id: "1",
          amount: 100,
          categoryId: "a",
          date: "2025-11-01",
          type: "Income",
          description: "Salary",
          userId: 1,
        },
        {
          id: "2",
          amount: 50,
          categoryId: "b",
          date: "2025-11-02",
          type: "Expenses",
          description: "Groceries",
          userId: 1,
        },
      ],
    });

    act(() => {
      useTransactionsStore.getState().clearTransactions();
    });

    expect(useTransactionsStore.getState().transactions).toEqual([]);
  });
});
