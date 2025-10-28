import {
  createCategory,
  updateCategoryApi,
  getCategories,
  deleteCategoryApi,
} from "./category.api";
import { Category } from "./category.types";
import { api } from "@/shared/lib/api";
import { useAuthStore } from "@/entities/auth/model/auth.store";

jest.mock("@/shared/lib/api");
jest.mock("@/entities/auth/model/auth.store");

const mockedApi = api as jest.Mocked<typeof api>;
const mockedAuthStore = useAuthStore as jest.Mocked<any>;

describe("Category API – with auth integration", () => {
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

  beforeEach(() => {
    jest.resetAllMocks();
    // Подставляем пользователя
    mockedAuthStore.getState.mockReturnValue({ user: { id: 1 } });
  });

  // --- CREATE ---
  describe("createCategory", () => {
    test("posts a new category with userId from auth store", async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: { ...mockNewCategory, id: "2" },
      });

      const result = await createCategory({
        name: "Salary",
        type: "Income",
      } as any);

      expect(result).toEqual({ ...mockNewCategory, id: "2" });
      expect(mockedApi.post).toHaveBeenCalledWith("/categories", {
        name: "Salary",
        type: "Income",
        userId: 1,
      });
    });

    test("throws if no user in auth store", async () => {
      mockedAuthStore.getState.mockReturnValue({ user: null });
      await expect(
        createCategory({ name: "Salary", type: "Income" } as any)
      ).rejects.toThrow("User not logged in");
    });
  });

  // --- UPDATE ---
  describe("updateCategoryApi", () => {
    test("updates category successfully", async () => {
      mockedApi.put.mockResolvedValueOnce({ data: mockCategory });
      const result = await updateCategoryApi(mockCategory);
      expect(result).toEqual(mockCategory);
      expect(mockedApi.put).toHaveBeenCalledWith(
        `/categories/${mockCategory.id}`,
        mockCategory
      );
    });

    test("throws if id is missing", async () => {
      const invalidCategory = { ...mockNewCategory } as any;
      await expect(updateCategoryApi(invalidCategory)).rejects.toThrow(
        "Category id is required"
      );
    });

    test("throws if name is empty", async () => {
      const invalidCategory = { ...mockCategory, name: "" };
      await expect(updateCategoryApi(invalidCategory)).rejects.toThrow(
        "Name is required"
      );
    });

    test("throws if type is invalid", async () => {
      const invalidCategory = { ...mockCategory, type: "Unknown" as any };
      await expect(updateCategoryApi(invalidCategory)).rejects.toThrow(
        "Invalid type"
      );
    });
  });

  // --- DELETE ---
  describe("deleteCategoryApi", () => {
    test("deletes category successfully", async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: mockCategory });
      const result = await deleteCategoryApi(mockCategory.id);
      expect(result).toEqual(mockCategory);
      expect(mockedApi.delete).toHaveBeenCalledWith(
        `/categories/${mockCategory.id}`
      );
    });
  });

  // --- GET ---
  describe("getCategories", () => {
    test("returns sorted array of categories", async () => {
      const unsorted: Category[] = [
        { ...mockCategory, name: "Zebra" },
        { ...mockCategory, name: "Apple" },
      ];
      mockedApi.get.mockResolvedValueOnce({ data: unsorted });

      const result = await getCategories();
      expect(result.map((c) => c.name)).toEqual(["Apple", "Zebra"]);
      expect(mockedApi.get).toHaveBeenCalledWith("/categories");
    });

    test("works with empty array", async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });
      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });
});
