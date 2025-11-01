import { create } from "zustand";
import { WidgetCardData } from "./widget.types";
import { defaultWidgets } from "@/shared/hooks/useWidgetsData"; // дефолтные виджеты

type WidgetsState = {
  widgets: WidgetCardData[]; // здесь мы будем хранить только UI-стейт
  setWidgets: (widgets: WidgetCardData[]) => void; // для ручной подстановки от хука
  clearWidgets: () => void; // сброс к дефолту
  openMenuId: string | null; // для управления открытым меню карточки
  setOpenMenuId: (id: string | null) => void; // управление меню
};

export const useWidgetsStore = create<WidgetsState>((set) => ({
  widgets: defaultWidgets,
  setWidgets: (widgets) => set({ widgets }),
  clearWidgets: () => set({ widgets: defaultWidgets }),
  openMenuId: null,
  setOpenMenuId: (id) => set({ openMenuId: id }),
}));

//----------------------

// import { create } from "zustand";
// import { WidgetCardData } from "./widget.types";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";

// type WidgetsState = {
//   widgets: WidgetCardData[];
//   refreshWidgets: () => void;
//   clearWidgets: () => void;
// };

// export const useWidgetsStore = create<WidgetsState>((set) => ({
//   widgets: [],

//   refreshWidgets: () => {
//     const { transactions } = useTransactionsStore.getState();

//     const incomeTx = transactions.filter((t) => t.type === "Income");
//     const expensesTx = transactions.filter((t) => t.type === "Expenses");

//     const incomeSum = incomeTx.reduce((acc, t) => acc + t.amount, 0);
//     const expensesSum = expensesTx.reduce((acc, t) => acc + t.amount, 0);
//     const balanceSum = incomeSum - expensesSum;

//     // для первой версии временно рандомный процент
//     const randomChange = () => Math.floor(Math.random() * 11) - 5; // -5..+5%

//     const newWidgets: WidgetCardData[] = [
//       {
//         id: "income",
//         title: "Total Income",
//         amount: incomeSum,
//         changePercent: randomChange(),
//         cardType: "income",
//         iconId: "income-icon",
//       },
//       {
//         id: "expenses",
//         title: "Total Expenses",
//         amount: expensesSum,
//         changePercent: randomChange(),
//         cardType: "expenses",
//         iconId: "expenses-icon",
//       },
//       {
//         id: "balance",
//         title: "Total Balance",
//         amount: balanceSum,
//         changePercent: randomChange(),
//         cardType: "balance",
//         iconId: "balance-icon",
//       },
//     ];

//     set({ widgets: newWidgets });
//   },
//   clearWidgets: () => set({ widgets: [] }),
// }));
