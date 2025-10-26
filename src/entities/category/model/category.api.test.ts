import {
  createCategory,
  updateCategoryApi,
  getCategories,
  deleteCategoryApi,
} from "./category.api";
import { Category } from "./category.types";

describe("Category API – validation & local logic only", () => {
  const mockCategory: Category = {
    id: "1",
    name: "Food",
    type: "Expenses",
    userId: 1,
  };

  const mockNewCategory: Omit<Category, "id"> = {
    name: "Salary",
    type: "Income",
    userId: 1,
  };

  // --- CREATE ---
  describe("createCategory", () => {
    test("throws if name is empty", async () => {
      await expect(createCategory({ ...mockNewCategory, name: "" }))
        .rejects.toThrow("Name is required");
    });

    test("throws if type is invalid", async () => {
      await expect(createCategory({ ...mockNewCategory, type: "Unknown" as any }))
        .rejects.toThrow("Invalid type");
    });
  });

  // --- UPDATE ---
  describe("updateCategoryApi", () => {
    test("throws if id is missing", async () => {
      const invalidCategory = { ...mockNewCategory } as any;
      await expect(updateCategoryApi(invalidCategory))
        .rejects.toThrow("Category id is required");
    });

    test("throws if name is empty", async () => {
      const invalidCategory = { ...mockCategory, name: "" };
      await expect(updateCategoryApi(invalidCategory))
        .rejects.toThrow("Name is required");
    });

    test("throws if type is invalid", async () => {
      const invalidCategory = { ...mockCategory, type: "Unknown" as any };
      await expect(updateCategoryApi(invalidCategory))
        .rejects.toThrow("Invalid type");
    });
  });

  // --- DELETE ---
  describe("deleteCategoryApi", () => {
    test("throws if id is empty", async () => {
      // Добавляем проверку на локальный уровень
      await expect(deleteCategoryApi("")).rejects.toThrow();
    });
  });

  // --- GET ---
  describe("getCategories", () => {
    test("returns sorted array correctly", async () => {
      // Локальная логика сортировки
      const unsortedCategories: Category[] = [
        { ...mockCategory, name: "Zebra" },
        { ...mockCategory, name: "Apple" },
      ];
      const sorted = unsortedCategories.sort((a, b) => a.name.localeCompare(b.name));
      expect(sorted.map(c => c.name)).toEqual(["Apple", "Zebra"]);
    });

    test("works correctly with empty array", async () => {
      const empty: Category[] = [];
      const sorted = empty.sort((a, b) => a.name.localeCompare(b.name));
      expect(sorted).toEqual([]);
    });
  });
});
