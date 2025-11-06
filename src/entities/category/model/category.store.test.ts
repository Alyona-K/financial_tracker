// --- MOCKS ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: {
    getState: () => ({
      user: {
        id: 1,
        email: "user@test.com",
        firstName: "Test",
        lastName: "User",
        avatar: "",
      },
      setUser: jest.fn(),
    }),
  },
}));

jest.mock("./category.api");

// --- IMPORTS ---
import { act } from "@testing-library/react";
import { useCategoriesStore } from "./category.store";
import { Category } from "@/entities/category/model/category.types";
import {
  getCategories,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
} from "./category.api";

// --- TESTS ---
describe("Categories Store", () => {
  const mockCategories: Category[] = [
    { id: "1", name: "Food", type: "Expenses", userId: 1 },
    { id: "2", name: "Salary", type: "Income", userId: 1 },
    { id: "3", name: "OtherUserCat", type: "Income", userId: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useCategoriesStore.setState({ categories: [], isLoading: false });
  });

  // --- FETCH ---
  it("should fetch categories for current user", async () => {
    (getCategories as jest.Mock).mockResolvedValue(mockCategories);

    await act(async () => {
      await useCategoriesStore.getState().fetchCategories();
    });

    const state = useCategoriesStore.getState();
    expect(getCategories).toHaveBeenCalled();
    expect(state.categories).toHaveLength(2);
    expect(state.categories[0].name).toBe("Food");
    expect(state.categories[1].name).toBe("Salary");
    expect(state.isLoading).toBe(false);
  });

  // --- ADD ---
  it("should add a new category", async () => {
    const newCat: Category = {
      id: "4",
      name: "Books",
      type: "Expenses",
      userId: 1,
    };
    (createCategory as jest.Mock).mockResolvedValue(newCat);

    await act(async () => {
      await useCategoriesStore.getState().addCategory({
        name: "Books",
        type: "Expenses",
        userId: 1,
      });
    });

    const state = useCategoriesStore.getState();
    expect(createCategory).toHaveBeenCalledWith({
      name: "Books",
      type: "Expenses",
      userId: 1,
    });
    expect(state.categories.some((c) => c.name === "Books")).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  // --- UPDATE ---
  it("should update an existing category", async () => {
    useCategoriesStore.setState({
      categories: [{ id: "1", name: "Food", userId: 1, type: "Expenses" }],
    });

    const updatedCat: Category = {
      id: "1",
      name: "Groceries",
      userId: 1,
      type: "Expenses",
    };
    (updateCategoryApi as jest.Mock).mockResolvedValue(updatedCat);

    await act(async () => {
      await useCategoriesStore.getState().updateCategory(updatedCat);
    });

    const state = useCategoriesStore.getState();
    expect(updateCategoryApi).toHaveBeenCalledWith(updatedCat);
    expect(state.categories[0].name).toBe("Groceries");
    expect(state.isLoading).toBe(false);
  });

  // --- DELETE ---
  it("should delete a category by id", async () => {
    useCategoriesStore.setState({
      categories: [
        { id: "1", name: "Food", type: "Expenses", userId: 1 },
        { id: "2", name: "Transport", type: "Expenses", userId: 1 },
      ],
    });

    (deleteCategoryApi as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await useCategoriesStore.getState().deleteCategory("1");
    });

    const state = useCategoriesStore.getState();
    expect(deleteCategoryApi).toHaveBeenCalledWith("1");
    expect(state.categories).toHaveLength(1);
    expect(state.categories[0].id).toBe("2");
    expect(state.isLoading).toBe(false);
  });

  // --- CLEAR ---
  it("should clear categories", () => {
    useCategoriesStore.setState({
      categories: [
        { id: "1", name: "Food", type: "Expenses", userId: 1 },
        { id: "2", name: "Transport", type: "Expenses", userId: 1 },
      ],
    });

    act(() => {
      useCategoriesStore.getState().clearCategories();
    });

    expect(useCategoriesStore.getState().categories).toEqual([]);
  });
});
