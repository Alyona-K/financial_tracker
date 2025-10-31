import { api } from "@/shared/lib/api";
import { Category } from "./category.types";
import { useUserStore } from "@/entities/user/model/user.store";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/categories");
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  const { user } = useUserStore.getState();
  if (!user) throw new Error("User not logged in");

  const { data } = await api.post<Category>("/categories", {
    ...category,
    userId: user.id,
  });
  return data;
};

export const updateCategoryApi = async (
  category: Category
): Promise<Category> => {
  if (!category.id) throw new Error("Category id is required");
  const { data } = await api.put<Category>(
    `/categories/${category.id}`,
    category
  );
  return data;
};

export const deleteCategoryApi = async (id: string): Promise<Category> => {
  const { data } = await api.delete<Category>(`/categories/${id}`);
  return data;
};
