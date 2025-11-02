import React from "react";
import CategoryRow from "@/entities/category/ui/CategoryRow";
import CategoryTableHeader from "@/entities/category/ui/CategoryTableHeader";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import "./CategoriesTable.scss";

interface CategoriesTableProps {
  onEditClick: (categoryId: string) => void;
  onDeleteClick: (categoryId: string) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ onEditClick, onDeleteClick }) => {
  const { categories, isLoading } = useCategoriesStore();

  return (
    <div className="categories-table">
      <CategoryTableHeader />

      {isLoading ? (
        <div className="categories-table__loading">Loading...</div>
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <CategoryRow
            key={category.id}
            categoryId={category.id} 
            onEdit={onEditClick}     
            onDelete={onDeleteClick}
          />
        ))
      ) : (
        <div className="categories-table__empty">No categories found</div>
      )}
    </div>
  );
};

export default CategoriesTable;

