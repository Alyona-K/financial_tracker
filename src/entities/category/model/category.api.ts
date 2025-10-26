import { api } from "@/shared/lib/api";
import { Category } from "./category.types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories");
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

export const createCategory = async (category: Omit<Category, "id">): Promise<Category> => {
  if (!category.name) throw new Error("Name is required");
  if (!["Income", "Expenses"].includes(category.type)) throw new Error("Invalid type");
  const { data } = await api.post<Category>("/categories", category);
  return data;
};

export const updateCategoryApi = async (category: Category): Promise<Category> => {
  if (!category.id) throw new Error("Category id is required");
  const { data } = await api.put<Category>(`/categories/${category.id}`, category);
  return data;
};

export const deleteCategoryApi = async (id: string): Promise<Category> => {
  const { data } = await api.delete<Category>(`/categories/${id}`);
  return data;
};

