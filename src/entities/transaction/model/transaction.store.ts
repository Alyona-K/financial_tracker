import { create } from "zustand";
import { Transaction, TransactionFormData } from "./transaction.types";
import { useUserStore } from "@/entities/user/model/user.store";
import {
  getTransactions,
  createTransaction,
  updateTransactionApi,
  deleteTransactionApi,
} from "./transaction.api";

type TransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<Transaction>;
  updateTransaction: (tx: TransactionFormData) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  clearTransactions: () => void;
};

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const user = useUserStore.getState().user;
      if (!user) {
        console.warn("[TransactionsStore] No user, skipping fetchTransactions");
        set({ transactions: [] });
        return;
      }

      const data = await getTransactions();
      const filtered = data.filter((tx) => tx.userId === user.id);
      set({ transactions: filtered });
    } catch (e) {
      console.error("Error fetching transactions:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (tx) => {
    set({ isLoading: true });
    try {
      const created = await createTransaction(tx);
      set((state) => ({
        transactions: [created, ...state.transactions],
      }));
      return created;
    } catch (e) {
      console.error("Error adding transaction:", e);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (tx) => {
  if (!tx.id) throw new Error("Transaction ID is required for update");
  set({ isLoading: true });
  try {
    const saved = await updateTransactionApi(tx as Transaction);
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === saved.id ? { ...t, ...saved, userId: t.userId } : t
      ),
    }));
    return saved;
  } catch (e) {
    console.error("Error updating transaction:", e);
    throw e;
  } finally {
    set({ isLoading: false });
  }
},

  deleteTransaction: async (id) => {
    set({ isLoading: true });
    try {
      await deleteTransactionApi(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (e) {
      console.error("Error deleting transaction:", e);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  clearTransactions: () => set({ transactions: [] }),
}));




