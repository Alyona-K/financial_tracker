import { useState } from "react";
import CategoriesTable from "./ui/CategoriesTable";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import Button from "@/shared/ui/Button";
import AddEditCategoryModal from "@/features/category/AddEditCategory/ui/AddEditCategoryModal";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import type { Category } from "@/entities/category/model/category.types";
import { FORM_MODE } from "@/shared/config/modes";
import "./CategoriesPage.scss";

function CategoriesPage() {
  const { addCategory, updateCategory, deleteCategory } = useCategoriesStore();
  const { setNotificationsCount } = useNotificationsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FORM_MODE>(FORM_MODE.ADD);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // открытие модалки на добавление
  const handleAddClick = () => {
    setModalMode(FORM_MODE.ADD);
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // открытие модалки на редактирование
  const handleEdit = (category: Category) => {
    setModalMode(FORM_MODE.EDIT);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // обработка сохранения из модалки
  const handleModalSubmit = async (category: Category) => {
    if (modalMode === FORM_MODE.ADD) {
      await addCategory(category);
      setNotificationsCount((prev: number) => prev + 1); // <-- увеличиваем счетчик
      alert("Category added!");
    } else {
      await updateCategory(category);
      setNotificationsCount((prev: number) => prev + 1); // можно увеличивать или не трогать, по логике
      alert("Category updated!");
    }
    setIsModalOpen(false);
  };

  // обработка удаления категории
  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setNotificationsCount((prev: number) => prev + 1); // <-- увеличиваем счетчик
    alert("Category deleted!");
  };

  return (
    <section className="categories">
      <div className="container">
        <SectionHeader
          title="Categories"
          text="Manage your categories to better organize your income and expenses. Add new categories or edit existing ones as needed."
        >
          <Button
            className="categories__btn btn btn--large"
            type="button"
            onClick={handleAddClick}
          >
            Add category
          </Button>
        </SectionHeader>
        <CategoriesTable
          onEditClick={(categoryId) => {
            const category = useCategoriesStore
              .getState()
              .categories.find((c) => c.id === categoryId);
            if (category) handleEdit(category);
          }}
          onDeleteClick={(categoryId) => handleDelete(categoryId)}
        />
        <AddEditCategoryModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialCategoryId={selectedCategory?.id}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </section>
  );
}

export default CategoriesPage;
