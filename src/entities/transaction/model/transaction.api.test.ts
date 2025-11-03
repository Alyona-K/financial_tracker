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
jest.mock("@/entities/user/model/user.store");

import {
  getTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi,
} from "./transaction.api";
import { Transaction } from "./transaction.types";
import { api } from "@/shared/lib/api";
import { useUserStore } from "@/entities/user/model/user.store";

const mockedApi = api as jest.Mocked<typeof api>;
const mockedAuthStore = useUserStore as jest.Mocked<any>;

describe("transaction.api", () => {
  const mockTransaction: Transaction = {
    id: "1",
    amount: 100,
    categoryId: "1",
    date: "2025-10-12",
    description: "Groceries",
    type: "Expenses",
    userId: 1,
  };

  const mockNewTransaction: Omit<Transaction, "id"> = {
    amount: 50,
    categoryId: "2",
    date: "2025-10-20",
    description: "Transport",
    type: "Expenses",
    userId: 1,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockedAuthStore.getState.mockReturnValue({ user: { id: 1 } });
  });

  // --- GET ---
  test("getTransactions returns array of transactions", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockTransaction] });
    const result = await getTransactions();
    expect(result).toEqual([mockTransaction]);
    expect(mockedApi.get).toHaveBeenCalledWith("/transactions");
  });

  test("getTransactions returns empty array if no transactions", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    const result = await getTransactions();
    expect(result).toEqual([]);
  });

  test("getTransactions throws if api fails", async () => {
    mockedApi.get.mockRejectedValueOnce(new Error("Server error"));
    await expect(getTransactions()).rejects.toThrow("Server error");
  });

  // --- CREATE ---
  test("createTransaction posts a new transaction successfully", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { ...mockNewTransaction, id: "2" },
    });
    const result = await createTransaction(mockNewTransaction);
    expect(result).toEqual({ ...mockNewTransaction, id: "2" });
    expect(mockedApi.post).toHaveBeenCalledWith("/transactions", {
      ...mockNewTransaction,
      userId: 1,
    });
  });

  test("createTransaction throws if api fails", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("Create failed"));
    await expect(createTransaction(mockNewTransaction)).rejects.toThrow(
      "Create failed"
    );
  });

  // --- UPDATE ---
  test("updateTransactionApi updates transaction successfully", async () => {
    mockedApi.patch.mockResolvedValueOnce({ data: mockTransaction });
    const result = await updateTransactionApi(mockTransaction);
    expect(result).toEqual(mockTransaction);
    expect(mockedApi.patch).toHaveBeenCalledWith(
      `/transactions/${mockTransaction.id}`,
      mockTransaction
    );
  });

  test("updateTransactionApi throws if api fails", async () => {
    mockedApi.patch.mockRejectedValueOnce(new Error("Update failed"));
    await expect(updateTransactionApi(mockTransaction)).rejects.toThrow(
      "Update failed"
    );
  });

  // --- DELETE ---
  test("deleteTransactionApi deletes transaction successfully", async () => {
    mockedApi.delete.mockResolvedValueOnce({ data: mockTransaction });
    const result = await deleteTransactionApi(mockTransaction.id);
    expect(result).toEqual(mockTransaction);
    expect(mockedApi.delete).toHaveBeenCalledWith(
      `/transactions/${mockTransaction.id}`
    );
  });

  test("deleteTransactionApi throws if api fails", async () => {
    mockedApi.delete.mockRejectedValueOnce(new Error("Delete failed"));
    await expect(deleteTransactionApi(mockTransaction.id)).rejects.toThrow(
      "Delete failed"
    );
  });

  // --- EDGE CASES ---
  test("createTransaction with invalid amount throws error", async () => {
    const invalidTx = { ...mockNewTransaction, amount: -10 };
    mockedApi.post.mockRejectedValueOnce(new Error("Invalid amount"));
    await expect(createTransaction(invalidTx)).rejects.toThrow(
      "Invalid amount"
    );
  });

  test("updateTransactionApi with missing id throws immediately", async () => {
    const invalidTx: Omit<Transaction, "id"> = {
      ...mockNewTransaction,
    };

    await expect(updateTransactionApi(invalidTx as any)).rejects.toThrow(
      "Transaction ID is required"
    );
  });
});
