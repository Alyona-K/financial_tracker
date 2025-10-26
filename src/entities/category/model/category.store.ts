import { create } from "zustand";
import { Category } from "./category.types";
import {
  getCategories,
  createCategory,
  updateCategoryApi,
  deleteCategoryApi,
} from "./category.api";

type CategoriesState = {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const data = await getCategories();
      set({ categories: data });
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true });
    try {
      const created = await createCategory(category);
      set((state) => ({
        categories: [...state.categories, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
    } catch (e) {
      console.error("Error adding category:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (category) => {
    if (!category.id) throw new Error("Category ID is required for update");
    set({ isLoading: true });
    try {
      const updated = await updateCategoryApi(category);
      set((state) => ({
        categories: state.categories
          .map((c) => (c.id === updated.id ? updated : c))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }));
    } catch (e) {
      console.error("Error updating category:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      await deleteCategoryApi(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (e) {
      console.error("Error deleting category:", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));

