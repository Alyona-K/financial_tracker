export interface Transaction {
  id: string;
  date: string;
  categoryId: string;
  type: "Income" | "Expenses";
  description: string;
  amount: number;
  userId?: number;
}

export interface TransactionFormData {
  id?: string;
  date: string;
  categoryId: string;
  type: "Income" | "Expenses";
  description: string;
  amount: number;
  userId?: number;
}