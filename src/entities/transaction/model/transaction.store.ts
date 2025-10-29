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
    const data = await getTransactions();
    const { user } = useUserStore.getState();
    const filtered = data.filter(tx => tx.userId === user?.id);
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

  clearTransactions: () => set({ transactions: [] }),
}));


  // fetchTransactions: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const data = await getTransactions();
  //     set({ transactions: data });
  //   } catch (e) {
  //     console.error("Error fetching transactions:", e);
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },



//------------------

// import { create } from "zustand";
// import { Transaction, TransactionFormData } from "./transaction.types";
// import {
//   getTransactions,
//   createTransaction,
//   updateTransactionApi,
//   deleteTransactionApi,
// } from "./transaction.api";
// import { useAuthStore } from "@/entities/auth/model/auth.store";

// type TransactionsState = {
//   transactions: Transaction[];
//   isLoading: boolean;
//   fetchTransactions: () => Promise<void>;
//   addTransaction: (tx: Omit<Transaction, "id">) => Promise<Transaction>;
//   updateTransaction: (tx: TransactionFormData) => Promise<Transaction>;
//   deleteTransaction: (id: string) => Promise<void>;
// };

// export const useTransactionsStore = create<TransactionsState>((set, get) => {
//   // подписка на инициализацию auth
//   useAuthStore.subscribe(
//     (state) => state.isInitialized,
//     (initialized) => {
//       const { token } = useAuthStore.getState();
//       if (initialized && token) get().fetchTransactions();
//     }
//   );

//   return {
//     transactions: [],
//     isLoading: false,

//     fetchTransactions: async () => {
//       const { token, isInitialized } = useAuthStore.getState();
//       if (!isInitialized || !token) {
//         console.warn("Auth not initialized or token missing — skipping fetch");
//         return;
//       }

//       set({ isLoading: true });
//       try {
//         const data = await getTransactions(); // токен берется внутри API
//         set({ transactions: data });
//       } catch (e) {
//         console.error("Error fetching transactions:", e);
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     addTransaction: async (tx) => {
//       const { isInitialized } = useAuthStore.getState();
//       if (!isInitialized) throw new Error("Auth not initialized");

//       set({ isLoading: true });
//       try {
//         const created = await createTransaction(tx); // токен внутри
//         set((state) => ({
//           transactions: [created, ...state.transactions],
//         }));
//         return created;
//       } catch (e) {
//         console.error("Error adding transaction:", e);
//         throw e;
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     updateTransaction: async (tx) => {
//       const { isInitialized } = useAuthStore.getState();
//       if (!isInitialized) throw new Error("Auth not initialized");
//       if (!tx.id) throw new Error("Transaction ID is required for update");

//       set({ isLoading: true });
//       try {
//         const saved = await updateTransactionApi(tx as Transaction); // токен внутри
//         set((state) => ({
//           transactions: state.transactions.map((t) =>
//             t.id === saved.id ? saved : t
//           ),
//         }));
//         return saved;
//       } catch (e) {
//         console.error("Error updating transaction:", e);
//         throw e;
//       } finally {
//         set({ isLoading: false });
//       }
//     },

//     deleteTransaction: async (id) => {
//       const { isInitialized } = useAuthStore.getState();
//       if (!isInitialized) throw new Error("Auth not initialized");

//       set({ isLoading: true });
//       try {
//         await deleteTransactionApi(id); // токен внутри
//         set((state) => ({
//           transactions: state.transactions.filter((t) => t.id !== id),
//         }));
//       } catch (e) {
//         console.error("Error deleting transaction:", e);
//         throw e;
//       } finally {
//         set({ isLoading: false });
//       }
//     },
//   };
// });

//---------------------

