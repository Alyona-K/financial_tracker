import { sortTransactions } from "./sortTransactions";
import { Transaction } from "@/entities/transaction/model/transaction.types";

describe("sortTransactions", () => {
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

  const ids = (arr: Transaction[]) => arr.map((t) => t.id);

  describe("sorting by date", () => {
    it("sorts ascending (oldest first)", () => {
      const result = sortTransactions(base, "date", "asc");
      expect(ids(result)).toEqual(["t3", "t2", "t1"]);
    });

    it("sorts descending (newest first)", () => {
      const result = sortTransactions(base, "date", "desc");
      expect(ids(result)).toEqual(["t1", "t2", "t3"]);
    });
  });

  describe("sorting by amount", () => {
    it("sorts ascending, taking type (Income/Expenses) into account", () => {
      const result = sortTransactions(base, "amount", "asc");
      // Income считается положительным, Expenses — отрицательным
      expect(ids(result)).toEqual(["t1", "t3", "t2"]);
    });

    it("sorts descending by effective amount", () => {
      const result = sortTransactions(base, "amount", "desc");
      expect(ids(result)).toEqual(["t2", "t3", "t1"]);
    });
  });

  describe("sorting by category name", () => {
    it("sorts ascending by linked category name", () => {
      const result = sortTransactions(base, "categoryId", "asc", categories);
      expect(ids(result)).toEqual(["t1", "t3", "t2"]); // Food < Salary
    });

    it("handles missing category gracefully (treats as 'deleted')", () => {
      const withDeleted: Transaction[] = [
        ...base,
        {
          id: "t4",
          amount: 10,
          type: "Expenses",
          categoryId: "999", // нет в списке
          date: "2025-10-13",
          description: "X",
        },
      ];

      const result = sortTransactions(
        withDeleted,
        "categoryId",
        "asc",
        categories
      );
      // "deleted" идёт раньше по алфавиту, чем Food и Salary
      expect(ids(result)[0]).toBe("t4");
    });
  });

  describe("sorting by string fields", () => {
    it("sorts by description descending (case-insensitive)", () => {
      const mixedCase: Transaction[] = [
        { ...base[0], description: "apple" },
        { ...base[1], description: "Banana" },
        { ...base[2], description: "cherry" },
      ];

      const result = sortTransactions(mixedCase, "description", "desc");
      expect(result.map((tx) => tx.description)).toEqual([
        "cherry",
        "Banana",
        "apple",
      ]);
    });
  });

  describe("edge behavior", () => {
    it("returns a new array (immutability check)", () => {
      const result = sortTransactions(base, "date", "asc");
      expect(result).not.toBe(base);
    });

    it("returns empty array if input is empty", () => {
      const result = sortTransactions([], "date", "asc");
      expect(result).toEqual([]);
    });

    it("handles equal values deterministically (stable sort)", () => {
      const sameDates = [
        { ...base[0], id: "a", date: "2025-01-01" },
        { ...base[1], id: "b", date: "2025-01-01" },
      ];
      const result = sortTransactions(sameDates, "date", "asc");
      expect(ids(result)).toEqual(["a", "b"]); // порядок сохраняется
    });
  });
});
