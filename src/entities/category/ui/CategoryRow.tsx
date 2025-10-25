import React, { useState } from "react";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import "./CategoryRow.css";

type CategoryRowProps = {
  categoryId: string; // теперь только id
  onEdit?: (categoryId: string) => void;
  onDelete?: (categoryId: string) => void;
};

const CategoryRow: React.FC<CategoryRowProps> = ({
  categoryId,
  onEdit,
  onDelete,
}) => {
  const { categories } = useCategoriesStore();

  // ищем объект категории по id
  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null; // если не нашли, ничего не рендерим

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <div className="category-row">
      <div className="category-row__cell">{category.name}</div>
      <div className="category-row__cell">{category.type}</div>
      <div className="category-row__cell category-row__cell--btns">
        <Button
          className="btn btn--medium"
          onClick={() => onEdit?.(category.id)}
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
          title="Delete category?"
          message="Are you sure you want to delete this category?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            onDelete?.(category.id);
            setIsDeleteOpen(false);
          }}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </div>
    </div>
  );
};

export default CategoryRow;
