import {
  getCategories,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
} from "./category.api";
import { Category } from "./category.types";

describe("category.api", () => {
  const mockCategory: Category = { id: "1", name: "Food", type: "Expenses" };

  let mockedFetch: jest.Mock;

  beforeEach(() => {
    // Мокаем глобальный fetch и типизируем
    mockedFetch = jest.fn();
    global.fetch = mockedFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // --- GET ---
  test("getCategories fetches data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockCategory],
    });

    const data = await getCategories();
    expect(data).toEqual([mockCategory]);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://localhost:3001/categories"
    );
  });

  test("getCategories throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(getCategories()).rejects.toThrow("Failed to fetch categories");
  });

  // --- CREATE ---
  test("createCategory posts data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategory,
    });

    const result = await createCategory(mockCategory);
    expect(result).toEqual(mockCategory);
    expect(mockedFetch).toHaveBeenCalledWith(
      "http://localhost:3001/categories",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockCategory),
      })
    );
  });

  test("createCategory throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(createCategory(mockCategory)).rejects.toThrow(
      "Failed to create category"
    );
  });

  // --- UPDATE ---
  test("updateCategoryApi updates data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategory,
    });

    const result = await updateCategoryApi(mockCategory);
    expect(result).toEqual(mockCategory);
    expect(mockedFetch).toHaveBeenCalledWith(
      `http://localhost:3001/categories/${mockCategory.id}`,
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockCategory),
      })
    );
  });

  test("updateCategoryApi throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(updateCategoryApi(mockCategory)).rejects.toThrow(
      "Failed to update category"
    );
  });

  // --- DELETE ---
  test("deleteCategoryApi deletes data successfully", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategory,
    });

    const result = await deleteCategoryApi(mockCategory.id);
    expect(result).toEqual(mockCategory);
    expect(mockedFetch).toHaveBeenCalledWith(
      `http://localhost:3001/categories/${mockCategory.id}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("deleteCategoryApi throws error when fetch fails", async () => {
    mockedFetch.mockResolvedValueOnce({ ok: false });

    await expect(deleteCategoryApi(mockCategory.id)).rejects.toThrow(
      "Failed to delete category"
    );
  });
});
