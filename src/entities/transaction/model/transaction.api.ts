import { api } from "@/shared/lib/api";
import { Transaction } from "./transaction.types";
import { useAuthStore } from "@/entities/auth/model/auth.store";

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data } = await api.get<Transaction[]>("/transactions");
  return data;
};

export const createTransaction = async (tx: Omit<Transaction, "id">): Promise<Transaction> => {
  const { user } = useAuthStore.getState();
  if (!user) throw new Error("User not logged in");
  
  const { data } = await api.post<Transaction>("/transactions", {
    ...tx,
    userId: user.id, // <-- добавляем userId
  });
  return data;
};

// export const createTransaction = async (tx: Omit<Transaction, "id">): Promise<Transaction> => {
//   const { data } = await api.post<Transaction>("/transactions", tx);
//   return data;
// };

export const updateTransactionApi = async (tx: Transaction): Promise<Transaction> => {
  if (!tx.id) throw new Error("Transaction ID is required");
  const { data } = await api.put<Transaction>(`/transactions/${tx.id}`, tx);
  return data;
};

export const deleteTransactionApi = async (id: string): Promise<Transaction> => {
  const { data } = await api.delete<Transaction>(`/transactions/${id}`);
  return data;
};




// import { api } from "@/shared/lib/api";
// import { Transaction } from "./transaction.types";
// import { useAuthStore } from "@/entities/auth/model/auth.store";

// /**
//  * Вспомогательная функция, чтобы получить текущий токен
//  */
// const getAuthToken = () => {
//   const { token } = useAuthStore.getState();
//   if (!token) throw new Error("Auth token not available");
//   return token;
// };

// export const getTransactions = async (): Promise<Transaction[]> => {
//   const token = getAuthToken();
//   const { data } = await api.get<Transaction[]>("/transactions", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };

// export const createTransaction = async (
//   tx: Omit<Transaction, "id">
// ): Promise<Transaction> => {
//   const token = getAuthToken();
//   const { data } = await api.post<Transaction>("/transactions", tx, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };

// export const updateTransactionApi = async (
//   tx: Transaction
// ): Promise<Transaction> => {
//   if (!tx.id) throw new Error("Transaction ID is required");
//   const token = getAuthToken();
//   const { data } = await api.put<Transaction>(`/transactions/${tx.id}`, tx, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };

// export const deleteTransactionApi = async (id: string): Promise<Transaction> => {
//   const token = getAuthToken();
//   const { data } = await api.delete<Transaction>(`/transactions/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };





// import { api } from "@/shared/lib/api";
// import { Transaction } from "./transaction.types";

// export const getTransactions = async (): Promise<Transaction[]> => {
//   const { data } = await api.get<Transaction[]>("/transactions");
//   return data;
// };

// export const createTransaction = async (tx: Omit<Transaction, "id">): Promise<Transaction> => {
//   const { data } = await api.post<Transaction>("/transactions", tx);
//   return data;
// };

// export const updateTransactionApi = async (tx: Transaction): Promise<Transaction> => {
//   if (!tx.id) throw new Error("Transaction ID is required");
//   const { data } = await api.put<Transaction>(`/transactions/${tx.id}`, tx);
//   return data;
// };

// export const deleteTransactionApi = async (id: string): Promise<Transaction> => {
//   const { data } = await api.delete<Transaction>(`/transactions/${id}`);
//   return data;
// };

