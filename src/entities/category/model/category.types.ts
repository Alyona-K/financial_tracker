export type CategoryType = "Income" | "Expenses";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  userId: number;
  isDeleted?: boolean;
};