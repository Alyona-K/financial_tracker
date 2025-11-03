import { api } from "@/shared/lib/api";
import { Transaction } from "./transaction.types";
import { useUserStore } from "@/entities/user/model/user.store";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
};

export const createTransaction = async (
  tx: Omit<Transaction, "id">
): Promise<Transaction> => {
  const { user } = useUserStore.getState();
  if (!user) throw new Error("User not logged in");

  const { data } = await api.post<Transaction>("/transactions", {
    ...tx,
    userId: user.id,
  });
  return data;
};

export const updateTransactionApi = async (
  tx: Transaction
): Promise<Transaction> => {
  if (!tx.id) throw new Error("Transaction ID is required");

  const { data } = await api.patch<Transaction>(`/transactions/${tx.id}`, tx);
  return data;
};

export const deleteTransactionApi = async (
  id: string
): Promise<Transaction> => {
  const { data } = await api.delete<Transaction>(`/transactions/${id}`);
  return data;
};
