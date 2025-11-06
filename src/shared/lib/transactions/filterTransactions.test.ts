import {
  filterTransactionsByCategory,
  filterTransactionsByType,
} from "./filterTransactions";
import { Transaction } from "@/entities/transaction/model/transaction.types";

describe("filterTransactions utils", () => {
  const categories = [
    { id: "1", name: "Food" },
    { id: "2", name: "Salary" },
  ];

  const base: Transaction[] = [
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

  const ids = (arr: Transaction[]) => arr.map((t) => t.id);

  // --- TESTS FOR FILTERING BY CATEGORY ---
  describe("filterTransactionsByCategory", () => {
    it("returns only transactions that belong to the selected category", () => {
      const result = filterTransactionsByCategory(base, "Food", categories);
      expect(result).toHaveLength(2);
      expect(result.every((tx) => tx.categoryId === "1")).toBe(true);
    });

    it("returns empty array when category name does not match any existing one", () => {
      const result = filterTransactionsByCategory(
        base,
        "Transport",
        categories
      );
      expect(result).toEqual([]);
    });

    it("treats missing category as 'Deleted' and filters correctly", () => {
      const withDeleted: Transaction[] = [
        ...base,
        { ...base[0], id: "t4", categoryId: "999" },
      ];

      const result = filterTransactionsByCategory(
        withDeleted,
        "Deleted",
        categories
      );
      expect(ids(result)).toEqual(["t4"]);
    });

    it("returns empty array if input list is empty", () => {
      const result = filterTransactionsByCategory([], "Food", categories);
      expect(result).toEqual([]);
    });

    it("does not mutate the original array", () => {
      const copy = [...base];
      filterTransactionsByCategory(copy, "Food", categories);
      expect(copy).toEqual(base);
    });
  });

  // --- TESTS FOR FILTERING BY TYPE ---
  describe("filterTransactionsByType", () => {
    it("returns only transactions of given type", () => {
      const expenses = filterTransactionsByType(base, "Expenses");
      expect(expenses).toHaveLength(2);
      expect(expenses.every((tx) => tx.type === "Expenses")).toBe(true);

      const income = filterTransactionsByType(base, "Income");
      expect(income).toHaveLength(1);
      expect(income[0].type).toBe("Income");
    });

    it("returns empty array when no transactions match given type", () => {
      const noIncome: Transaction[] = base.filter((t) => t.type !== "Income");
      const result = filterTransactionsByType(noIncome, "Income");
      expect(result).toEqual([]);
    });

    it("handles empty input safely", () => {
      expect(filterTransactionsByType([], "Expenses")).toEqual([]);
    });

    it("does not mutate the input array", () => {
      const copy = [...base];
      filterTransactionsByType(copy, "Expenses");
      expect(copy).toEqual(base);
    });
  });
});
