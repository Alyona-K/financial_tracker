import {
  filterTransactionsByCategory,
  filterTransactionsByType,
} from "./filterTransactions";
import { Transaction } from "@/entities/transaction/model/transaction.types";

describe("filterTransactions", () => {
  const categories = [
    { id: "1", name: "Food" },
    { id: "2", name: "Salary" },
  ];

  const transactions: Transaction[] = [
    {
      id: "t1",
      amount: 100,
      type: "Expenses",
      categoryId: "1",
      date: "2025-10-12",
      description: "",
    },
    {
      id: "t2",
      amount: 200,
      type: "Income",
      categoryId: "2",
      date: "2025-10-11",
      description: "",
    },
    {
      id: "t3",
      amount: 50,
      type: "Expenses",
      categoryId: "1",
      date: "2025-10-10",
      description: "",
    },
  ];

  test("filterTransactionsByCategory returns only transactions of selected category", () => {
    const result = filterTransactionsByCategory(
      transactions,
      "Food",
      categories
    );
    expect(result).toHaveLength(2);
    expect(result.every((tx) => tx.categoryId === "1")).toBe(true);
  });

  test("filterTransactionsByCategory returns empty array if no matches", () => {
    const result = filterTransactionsByCategory(
      transactions,
      "Transport",
      categories
    );
    expect(result).toHaveLength(0);
  });

  test("filterTransactionsByType returns only transactions of given type", () => {
    const expenses = filterTransactionsByType(transactions, "Expenses");
    expect(expenses).toHaveLength(2);
    expect(expenses.every((tx) => tx.type === "Expenses")).toBe(true);

    const income = filterTransactionsByType(transactions, "Income");
    expect(income).toHaveLength(1);
    expect(income[0].type).toBe("Income");
  });
});
