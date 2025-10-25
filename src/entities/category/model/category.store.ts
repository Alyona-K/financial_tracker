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

//------------------

// import { create } from "zustand";
// import { Category } from "./category.types";
// import {
//   getCategories,
//   createCategory,
//   updateCategoryApi,
//   deleteCategoryApi,
// } from "./category.api";

// type CategoriesState = {
//   categories: Category[];
//   isLoading: boolean;
//   fetchCategories: () => Promise<void>;
//   addCategory: (category: Omit<Category, "id">) => Promise<void>;
//   updateCategory: (category: Category) => Promise<void>;
//   deleteCategory: (id: string) => Promise<void>;
// };

// export const useCategoriesStore = create<CategoriesState>((set) => ({
//   categories: [],
//   isLoading: false,

//   fetchCategories: async () => {
//     set({ isLoading: true });
//     try {
//       const data = await getCategories();
//       set({ categories: data });
//     } catch (e) {
//       console.error("[CategoryStore] Error fetching categories:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   addCategory: async (category) => {
//     set({ isLoading: true });
//     try {
//       const created = await createCategory(category);
//       set((state) => ({
//         categories: [...state.categories, created].sort((a, b) =>
//           a.name.localeCompare(b.name)
//         ),
//       }));
//     } catch (e) {
//       console.error("[CategoryStore] Error adding category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateCategory: async (category) => {
//     if (!category.id) throw new Error("Category ID is required for update");
//     set({ isLoading: true });
//     try {
//       const updated = await updateCategoryApi(category);
//       set((state) => ({
//         categories: state.categories
//           .map((c) => (c.id === updated.id ? updated : c))
//           .sort((a, b) => a.name.localeCompare(b.name)),
//       }));
//     } catch (e) {
//       console.error("[CategoryStore] Error updating category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   deleteCategory: async (id) => {
//     set({ isLoading: true });
//     try {
//       await deleteCategoryApi(id);
//       set((state) => ({
//         categories: state.categories.filter((c) => c.id !== id),
//       }));
//       // транзакции не трогаем
//     } catch (e) {
//       console.error("[CategoryStore] Error deleting category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));


//----------------

// import { create } from "zustand";
// import { Category } from "./category.types";
// import {
//   getCategories,
//   createCategory,
//   updateCategoryApi,
//   deleteCategoryApi,
// } from "./category.api";
// import { useTransactionsStore } from "@/entities/transaction/model/transaction.store";

// type CategoriesState = {
//   categories: (Category & { isDeleted?: boolean })[];
//   isLoading: boolean;
//   fetchCategories: () => Promise<void>;
//   addCategory: (category: Omit<Category, "id">) => Promise<void>;
//   updateCategory: (category: Category) => Promise<void>;
//   deleteCategory: (id: string) => Promise<void>;
// };

// export const useCategoriesStore = create<CategoriesState>((set) => ({
//   categories: [],
//   isLoading: false,

//   fetchCategories: async () => {
//     set({ isLoading: true });
//     try {
//       const data = await getCategories();
//       set({ categories: data });
//     } catch (e) {
//       console.error("Error fetching categories:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   addCategory: async (category) => {
//     set({ isLoading: true });
//     try {
//       const created = await createCategory(category);
//       set((state) => ({
//         categories: [...state.categories, created].sort((a, b) =>
//           a.name.localeCompare(b.name)
//         ),
//       }));
//     } catch (e) {
//       console.error("Error adding category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateCategory: async (category) => {
//     if (!category.id) throw new Error("Category ID is required for update");
//     set({ isLoading: true });
//     try {
//       const updated = await updateCategoryApi(category);
//       set((state) => ({
//         categories: state.categories
//           .map((c) => (c.id === updated.id ? updated : c))
//           .sort((a, b) => a.name.localeCompare(b.name)),
//       }));
//     } catch (e) {
//       console.error("Error updating category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   deleteCategory: async (id) => {
//     set({ isLoading: true });
//     try {
//       await deleteCategoryApi(id);
//       // вместо фильтрации помечаем как удалённую
//       set((state) => ({
//         categories: state.categories.map((c) =>
//           c.id === id ? { ...c, isDeleted: true, name: "Deleted" } : c
//         ),
//       }));

//       // уведомляем стор транзакций, что категория удалена
//       useTransactionsStore.getState().markCategoryDeleted(id);
//     } catch (e) {
//       console.error("Error deleting category:", e);
//     } finally {
//       set({ isLoading: false });
//     }
//   },
// }));



//------------





//------
// import { create } from "zustand";
// import { Category } from "./category.types";
// import {
//   getCategories,
//   createCategory,
//   updateCategoryApi,
//   deleteCategoryApi,
// } from "./category.api";

// type CategoriesState = {
//   categories: Category[];
//   isLoading: boolean;
//   fetchCategories: () => Promise<void>;
//   addCategory: (category: Omit<Category, "id">) => Promise<void>;
//   updateCategory: (category: Category) => Promise<void>;
//   deleteCategory: (id: string) => Promise<void>;
// };

// export const useCategoriesStore = create<CategoriesState>((set) => ({
//   categories: [],
//   isLoading: false,

//   fetchCategories: async () => {
//     set({ isLoading: true });
//     try {
//       const data = await getCategories();
//       set({
//         categories: data.sort((a, b) => a.name.localeCompare(b.name)), // сортировка по алфавиту
//         isLoading: false,
//       });
//     } catch (e) {
//       console.error(e);
//       set({ isLoading: false });
//     }
//   },

//   addCategory: async (category) => {
//     try {
//       const created = await createCategory({
//         ...category,
//         id: crypto.randomUUID(),
//       });
//       set((state) => ({
//         categories: [...state.categories, created].sort((a, b) =>
//           a.name.localeCompare(b.name)
//         ),
//       }));
//     } catch (e) {
//       console.error("Error adding category:", e);
//     }
//   },

//   updateCategory: async (category) => {
//     if (!category.id) throw new Error("Category ID is required for update");
//     try {
//       const updated = await updateCategoryApi(category);
//       set((state) => ({
//         categories: state.categories.map((c) =>
//           c.id === updated.id ? updated : c
//         ),
//       }));
//     } catch (e) {
//       console.error(e);
//     }
//   },

//   deleteCategory: async (id) => {
//     try {
//       await deleteCategoryApi(id);
//       set((state) => ({
//         categories: state.categories.filter((c) => c.id !== id),
//       }));
//     } catch (e) {
//       console.error(e);
//     }
//   },
// }));

//---

// addCategory: async (category) => {
//   try {
//     const created = await createCategory({
//       ...category,
//       id: crypto.randomUUID(),
//     });
//     set((state) => ({
//       categories: [...state.categories, created].sort((a, b) =>
//         a.name.localeCompare(b.name)
//       ),
//     }));
//   } catch (e) {
//     console.error(e);
//   }
// },
