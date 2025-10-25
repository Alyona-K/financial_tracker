// import { create } from "zustand";
// import { categories as mockCategories, Category } from "@/data/mock/categories";

// type CategoriesState = {
//   categories: Category[];
//   isLoading: boolean;
//   fetchCategories: () => Promise<void>;
//   addCategory: (newCategory: Category) => void;
//   deleteCategory: (id: string) => void;
//   updateCategory: (updatedCategory: Category) => void;
// };

// export const useCategoriesStore = create<CategoriesState>((set) => ({
//   categories: [],
//   isLoading: false,

//   fetchCategories: async () => {
//     set({ isLoading: true });
//     await new Promise((resolve) => setTimeout(resolve, 500)); // имитация загрузки
//     set({ categories: mockCategories, isLoading: false });
//   },

//   addCategory: (newCategory) =>
//     set((state) => ({
//       categories: [newCategory, ...state.categories],
//     })),

//   deleteCategory: (id) =>
//     set((state) => ({
//       categories: state.categories.filter((cat) => cat.id !== id),
//     })),

//   updateCategory: (updatedCategory) =>
//     set((state) => ({
//       categories: state.categories.map((cat) =>
//         cat.id === updatedCategory.id ? updatedCategory : cat
//       ),
//     })),
// }));
