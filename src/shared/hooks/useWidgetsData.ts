import { useEffect, useState } from "react";
import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
import { WidgetCardData } from "@/entities/widget/model/widget.types";

export const useWidgetsData = () => {
  const { transactions, fetchTransactions } = useTransactionsStore();
  const [widgets, setWidgets] = useState<WidgetCardData[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const sumByMonth = (type: "Income" | "Expenses", month: number, year: number) =>
      transactions
        .filter(
          (t) =>
            t.type === type &&
            new Date(t.date).getMonth() === month &&
            new Date(t.date).getFullYear() === year
        )
        .reduce((sum, t) => sum + t.amount, 0);

    const incomeCurrent = sumByMonth("Income", currentMonth, currentYear);
    const incomePrev = sumByMonth("Income", previousMonth, previousYear);

    const expensesCurrent = sumByMonth("Expenses", currentMonth, currentYear);
    const expensesPrev = sumByMonth("Expenses", previousMonth, previousYear);

    const balanceCurrent = incomeCurrent - expensesCurrent;
    const balancePrev = incomePrev - expensesPrev;

    const calcChange = (current: number, prev: number) =>
      prev === 0 ? 0 : Math.round(((current - prev) / prev) * 100);

    setWidgets([
      {
        id: "income",
        title: "Total Income",
        amount: incomeCurrent,
        changePercent: calcChange(incomeCurrent, incomePrev),
        cardType: "income",
        iconId: "income-icon",
      },
      {
        id: "expenses",
        title: "Total Expenses",
        amount: expensesCurrent,
        changePercent: calcChange(expensesCurrent, expensesPrev),
        cardType: "expenses",
        iconId: "expenses-icon",
      },
      {
        id: "balance",
        title: "Total Balance",
        amount: balanceCurrent,
        changePercent: calcChange(balanceCurrent, balancePrev),
        cardType: "balance",
        iconId: "balance-icon",
      },
    ]);
  }, [transactions]);

  return { widgets };
};




// import { useEffect, useState } from "react";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";
// import { WidgetCardData } from "@/entities/widget/model/widget.types";

// export const useWidgetsData = () => {
//   const { transactions, fetchTransactions } = useTransactionsStore();
//   const [widgets, setWidgets] = useState<WidgetCardData[]>([]);

//   useEffect(() => {
//     fetchTransactions();
//   }, [fetchTransactions]);

//   useEffect(() => {
//     if (!transactions || transactions.length === 0) return;

//     const income = transactions
//       .filter((t) => t.type === "Income")
//       .reduce((sum, t) => sum + t.amount, 0);

//     const expenses = transactions
//       .filter((t) => t.type === "Expenses")
//       .reduce((sum, t) => sum + t.amount, 0);

//     const balance = income - expenses;

//     const randomChange = () => Math.floor(Math.random() * 11) - 5; // -5..+5%

//     setWidgets([
//       {
//         id: "income",
//         title: "Total Income",
//         amount: income,
//         changePercent: randomChange(),
//         cardType: "income",
//         iconId: "income-icon",
//       },
//       {
//         id: "expenses",
//         title: "Total Expenses",
//         amount: expenses,
//         changePercent: randomChange(),
//         cardType: "expenses",
//         iconId: "expenses-icon",
//       },
//       {
//         id: "balance",
//         title: "Total Balance",
//         amount: balance,
//         changePercent: randomChange(),
//         cardType: "balance",
//         iconId: "balance-icon",
//       },
//     ]);
//   }, [transactions]);

//   return { widgets };
// };
