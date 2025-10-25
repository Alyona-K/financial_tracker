import React from "react";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import { formatDate } from "@/shared/lib/formatDate";
import { TYPE_COLORS } from "@/shared/config/colors";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import "./RecentTransactionRow.css";

type RecentTransactionRowProps = {
  date: string;
  description: string;
  categoryId: string;
  type: "Income" | "Expenses";
  amount: number;
};

export const RecentTransactionRow: React.FC<RecentTransactionRowProps> = ({
  date,
  description,
  categoryId,
  type,
  amount,
}) => {
  const { categories } = useCategoriesStore();
  // const category = categories.find(c => c.id === categoryId)?.name || categoryId;
  const category =
    categories.find((c) => String(c.id) === String(categoryId))?.name ||
    "Deleted";
  return (
    <div className="recent-transaction-row">
      <div className="recent-transaction-row__cell">{formatDate(date)}</div>
      <div className="recent-transaction-row__cell">{description}</div>
      <div
        className={`recent-transaction-row__cell ${
          category === "Deleted" ? "recent-transaction-row__deleted" : ""
        }`}
      >
        {category}
      </div>
      <div
        className="recent-transaction-row__cell"
        style={{ color: TYPE_COLORS[type] }}
      >
        {formatCurrency(amount, type)}
      </div>
    </div>
  );
};

export default RecentTransactionRow;
