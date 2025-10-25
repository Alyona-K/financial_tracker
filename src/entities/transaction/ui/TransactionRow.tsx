import React, { useState } from "react";
import Button from "@/shared/ui/Button";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import { formatDate } from "@/shared/lib/formatDate";
import { TYPE_COLORS } from "@/shared/config/colors";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import "./TransactionRow.css";

type TransactionRowProps = {
  date: string;
  description: string;
  // categoryId: string; // теперь только id
  categoryName: string;
  type: "Income" | "Expenses";
  amount: number;
  searchQuery?: string;
  onEdit?: (transaction: {
    date: string;
    description: string;
    // categoryId: string;
    categoryName: string;
    type: "Income" | "Expenses";
    amount: number;
  }) => void;
  onDelete?: () => void;
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
  date,
  description,
  categoryName,
  type,
  amount,
  searchQuery = "",
  onEdit,
  onDelete,
}) => {
  const { categories } = useCategoriesStore();

  // ищем название категории по id
  const category = categoryName;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="transaction-row">
      <div
        className="transaction-row__cell transaction-row__date"
        dangerouslySetInnerHTML={{
          __html: highlightText(formatDate(date), searchQuery),
        }}
      />

      <div
        className="transaction-row__cell transaction-row__desc"
        dangerouslySetInnerHTML={{
          __html: highlightText(description, searchQuery),
        }}
      />

      <div className="transaction-row__cell transaction-row__category">
        <span
          className={category === "Deleted" ? "transaction-row__deleted" : ""}
          dangerouslySetInnerHTML={{
            __html: highlightText(category, searchQuery),
          }}
        />
      </div>

      <div
        className="transaction-row__cell transaction-row__type"
        dangerouslySetInnerHTML={{
          __html: highlightText(type, searchQuery),
        }}
      />

      <div
        className="transaction-row__cell transaction-row__amount"
        style={{ color: TYPE_COLORS[type] }}
        dangerouslySetInnerHTML={{
          __html: highlightText(formatCurrency(amount, type), searchQuery),
        }}
      />

      <div className="transaction-row__cell transaction-row__cell--btns">
        <Button
          className="btn btn--medium"
          onClick={() =>
            onEdit?.({
              date,
              description,
              categoryName,
              type,
              amount,
            })
          }
        >
          Edit
        </Button>
        <Button
          className="btn btn--medium btn--delete"
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </Button>
        <ConfirmModal
          isOpen={isDeleteOpen}
          title="Delete transaction?"
          message="Are you sure you want to delete this transaction?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            onDelete?.();
            setIsDeleteOpen(false);
          }}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </div>
    </div>
  );
};

export default TransactionRow;
