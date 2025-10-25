import { api } from "@/shared/lib/api";
import { Transaction } from "./transaction.types";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
};

export const createTransaction = async (tx: Omit<Transaction, "id">): Promise<Transaction> => {
  const { data } = await api.post<Transaction>("/transactions", tx);
  return data;
};

export const updateTransactionApi = async (tx: Transaction): Promise<Transaction> => {
  const { data } = await api.put<Transaction>(`/transactions/${tx.id}`, tx);
  return data;
};

export const deleteTransactionApi = async (id: string): Promise<Transaction> => {
  const { data } = await api.delete<Transaction>(`/transactions/${id}`);
  return data;
};

