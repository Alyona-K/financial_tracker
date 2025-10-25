import { sortTransactions } from "./sortTransactions";
import { Transaction } from "@/entities/transaction/model/transaction.types";

describe("sortTransactions", () => {
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
      description: "A",
    },
    {
      id: "t2",
      amount: 200,
      type: "Income",
      categoryId: "2",
      date: "2025-10-11",
      description: "B",
    },
    {
      id: "t3",
      amount: 50,
      type: "Expenses",
      categoryId: "1",
      date: "2025-10-10",
      description: "C",
    },
  ];

  test("sorts by date ascending", () => {
    const result = sortTransactions(transactions, "date", "asc");
    expect(result.map((tx) => tx.id)).toEqual(["t3", "t2", "t1"]);
  });

  test("sorts by date descending", () => {
    const result = sortTransactions(transactions, "date", "desc");
    expect(result.map((tx) => tx.id)).toEqual(["t1", "t2", "t3"]);
  });

  test("sorts by amount ascending", () => {
    const result = sortTransactions(transactions, "amount", "asc");
    expect(result.map((tx) => tx.id)).toEqual(["t1", "t3", "t2"]);
  });

  test("sorts by amount descending", () => {
    const result = sortTransactions(transactions, "amount", "desc");
    expect(result.map((tx) => tx.id)).toEqual(["t2", "t3", "t1"]);
  });

  test("sorts by category name ascending", () => {
    const result = sortTransactions(
      transactions,
      "categoryId",
      "asc",
      categories
    );
    expect(result.map((tx) => tx.id)).toEqual(["t1", "t3", "t2"]); // Food < Salary
  });

  test("sorts by description descending", () => {
    const result = sortTransactions(transactions, "description", "desc");
    expect(result.map((tx) => tx.description)).toEqual(["C", "B", "A"]);
  });
});
