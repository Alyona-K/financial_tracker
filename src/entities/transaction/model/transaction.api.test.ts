import {
  getTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi,
} from "./transaction.api";
import { Transaction } from "./transaction.types";

describe("transaction.api", () => {
  const mockTransaction: Transaction = {
    id: "1",
    amount: 100,
    categoryId: "1",
    date: "2025-10-12",
    description: "Groceries",
    type: "Expenses",
  };

  let mockedFetch: jest.Mock;

  beforeEach(() => {
    // Мокаем глобальный fetch и типизируем
    mockedFetch = jest.fn();
    global.fetch = mockedFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // --- GET ---
  test("getTransactions fetches data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockTransaction],
    });

    const data = await getTransactions();
    expect(data).toEqual([mockTransaction]);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://localhost:3001/transactions"
    );
  });

  test("getTransactions throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(getTransactions()).rejects.toThrow(
      "Failed to fetch transactions"
    );
  });

  // --- CREATE ---
  test("createTransaction posts data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransaction,
    });

    const result = await createTransaction(mockTransaction);
    expect(result).toEqual(mockTransaction);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://localhost:3001/transactions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockTransaction),
      })
    );
  });

  test("createTransaction throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(createTransaction(mockTransaction)).rejects.toThrow(
      "Failed to create transaction"
    );
  });

  // --- UPDATE ---
  test("updateTransactionApi updates data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransaction,
    });

    const result = await updateTransactionApi(mockTransaction);
    expect(result).toEqual(mockTransaction);
    expect(mockedFetch).toHaveBeenCalledWith(
      `http://localhost:3001/transactions/${mockTransaction.id}`,
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockTransaction),
      })
    );
  });

  test("updateTransactionApi throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(updateTransactionApi(mockTransaction)).rejects.toThrow(
      "Failed to update transaction"
    );
  });

  // --- DELETE ---
  test("deleteTransactionApi deletes data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransaction,
    });

    const result = await deleteTransactionApi(mockTransaction.id);
    expect(result).toEqual(mockTransaction);
    expect(mockedFetch).toHaveBeenCalledWith(
      `http://localhost:3001/transactions/${mockTransaction.id}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("deleteTransactionApi throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteTransactionApi(mockTransaction.id)).rejects.toThrow(
      "Failed to delete transaction"
    );
  });
});
