import { create } from "zustand";
import { Transaction, TransactionFormData } from "./transaction.types";
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
};

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const data = await getTransactions();
      set({ transactions: data });
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
          t.id === saved.id ? saved : t
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
}));


//---------------

// import { create } from "zustand";
// import { Transaction } from "./transaction.types";
// import {
//   getTransactions,
//   createTransaction,
//   updateTransactionApi,
//   deleteTransactionApi,
// } from "./transaction.api";
// import { useCategoriesStore } from "@/entities/category/model/category.store";

// export type TransactionWithCategoryName = Transaction & {
//   categoryName: string;
// };

// type TransactionsState = {
//   transactions: Transaction[];
//   isLoading: boolean;
//   fetchTransactions: () => Promise<void>;
//   addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
//   updateTransaction: (t: Transaction) => Promise<void>;
//   deleteTransaction: (id: string) => Promise<void>;
//   getTransactionsWithCategoryNames: () => TransactionWithCategoryName[];
// };

// export const useTransactionsStore = create<TransactionsState>((set, get) => {
//   let cachedTxs: TransactionWithCategoryName[] | null = null;
//   let lastTxsLength = 0;
//   let lastCategoriesLength = 0;

//   return {
//     transactions: [],
//     isLoading: false,

//     fetchTransactions: async () => {
//       set({ isLoading: true });
//       try {
//         const data = await getTransactions();
//         set({ transactions: data });
//       } catch (e) {
//         console.error("[TransactionStore] Error fetching transactions:", e);
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     addTransaction: async (transaction) => {
//       set({ isLoading: true });
//       try {
//         const created = await createTransaction(transaction);
//         set((state) => ({ transactions: [...state.transactions, created] }));
//       } catch (e) {
//         console.error("[TransactionStore] Error adding transaction:", e);
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     updateTransaction: async (transaction) => {
//       if (!transaction.id) throw new Error("Transaction ID required");
//       set({ isLoading: true });
//       try {
//         const updated = await updateTransactionApi(transaction);
//         set((state) => ({
//           transactions: state.transactions.map((t) =>
//             t.id === updated.id ? updated : t
//           ),
//         }));
//       } catch (e) {
//         console.error("[TransactionStore] Error updating transaction:", e);
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     deleteTransaction: async (id) => {
//       set({ isLoading: true });
//       try {
//         await deleteTransactionApi(id);
//         set((state) => ({
//           transactions: state.transactions.filter((t) => t.id !== id),
//         }));
//       } catch (e) {
//         console.error("[TransactionStore] Error deleting transaction:", e);
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     getTransactionsWithCategoryNames: () => {
//       const { transactions } = get();
//       const categories = useCategoriesStore.getState().categories;

//       if (
//         transactions.length === lastTxsLength &&
//         categories.length === lastCategoriesLength &&
//         cachedTxs
//       ) {
//         return cachedTxs;
//       }

//       cachedTxs = transactions.map((tx) => {
//         const category = categories.find((c) => c.id === tx.categoryId);
//         return { ...tx, categoryName: category ? category.name : "Deleted" };
//       });

//       lastTxsLength = transactions.length;
//       lastCategoriesLength = categories.length;

//       return cachedTxs;
//     },
//   };
// });

//-----------


