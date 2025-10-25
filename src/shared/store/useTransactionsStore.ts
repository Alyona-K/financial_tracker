// import { create } from "zustand";
// import {
//   transactions as mockTransactions,
//   Transaction,
// } from "@/data/mock/transactions";
// type TransactionsState = {
//   transactions: Transaction[];
//   isLoading: boolean;
//   fetchTransactions: () => Promise<void>;
//   addTransaction: (newTx: Transaction) => void;
//   deleteTransaction: (id: string) => void;
//   updateTransaction: (updatedTx: Transaction) => void;
// };

// export const useTransactionsStore = create<TransactionsState>((set) => ({
//   transactions: [],
//   isLoading: false,
//   fetchTransactions: async () => {
//     set({ isLoading: true });
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // имитация загрузки
//     set({ transactions: mockTransactions, isLoading: false });
//   },
//   addTransaction: (newTx) =>
//     set((state) => ({ transactions: [newTx, ...state.transactions] })),
//   deleteTransaction: (id) =>
//     set((state) => ({
//       transactions: state.transactions.filter((t) => t.id !== id),
//     })),
//   updateTransaction: (updatedTx) =>
//     set((state) => ({
//       transactions: state.transactions.map((t) =>
//         t.id === updatedTx.id ? updatedTx : t
//       ),
//     })),
// }));
