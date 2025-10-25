import React, { useState, useEffect } from "react";
import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Dropdown from "@/shared/ui/Dropdown";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import type { Category } from "@/entities/category/model/category.types";
import { FORM_MODE } from "@/shared/config/modes";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import "./AddEditCategoryModal.css";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
  mode: FORM_MODE;
  initialCategoryId?: string;
}

interface CategoryFormUI {
  id?: string;
  name: string;
  type: string;
}

const TYPE_OPTIONS = ["Income", "Expenses"];

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialCategoryId,
}) => {
  const isEdit = mode === FORM_MODE.EDIT;

  const { categories, fetchCategories } = useCategoriesStore();

  const [form, setForm] = useState<CategoryFormUI>({
    id: undefined,
    name: "",
    type: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormUI, string>>
  >({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuthStore();

  // --- Load categories ---
  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories, fetchCategories]);

  // --- Reset form on open ---
  useEffect(() => {
    if (isOpen) {
      const category = categories.find((c) => c.id === initialCategoryId);
      setForm({
        id: category?.id,
        name: category?.name || "",
        type: category?.type || "",
      });
      setErrors({});
      setIsDropdownOpen(false);
    }
  }, [isOpen, initialCategoryId, categories]);

  const handleChange = (field: keyof CategoryFormUI, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof CategoryFormUI, string>> = {};
    const trimmedName = form.name.trim();

    if (!trimmedName) newErrors.name = "Name is required";
    if (!form.type) newErrors.type = "Type is required";

    const nameExists = categories.some(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== form.id
    );
    if (nameExists) newErrors.name = "Category with this name already exists";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const categoryToSave: Category = {
      id: form.id || crypto.randomUUID(),
      name: trimmedName,
      type: form.type as "Income" | "Expenses",
      userId: user?.id || 0,
    };

    onSubmit(categoryToSave);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit category" : "Add new category"}
    >
      <form className="add-edit-category-form" onSubmit={handleSubmit}>
        {/* --- NAME --- */}
        <div className="add-edit-category-form__name">
          <Input
            label="Name"
            placeholder="Enter category name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            wrapperClassName="add-edit-category-form__name-wrap"
            labelClassName="add-edit-category-form__name-label"
            fieldClassName="add-edit-category-form__name-field"
          />
          {errors.name && (
            <span className="add-edit-category-form__form-error">
              {errors.name}
            </span>
          )}
        </div>

        {/* --- TYPE --- */}
        <div className="add-edit-category-form__type">
          <Dropdown
            label="Type"
            placeholder="Select type"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={(selected) => handleChange("type", selected)}
            showAllOption={false}
            wrapperClassName="add-edit-category-form__dropdown-wrapper"
            buttonClassName="add-edit-category-form__dropdown-btn"
            listClassName="add-edit-category-form__dropdown-list"
            itemClassName="add-edit-category-form__dropdown-item"
            labelClassName="add-edit-category-form__dropdown-label"
            isOpen={isDropdownOpen}
            onToggle={toggleDropdown}
            onClose={closeDropdown}
          />
          {errors.type && (
            <span className="add-edit-category-form__form-error">
              {errors.type}
            </span>
          )}
        </div>

        <button type="submit" className="btn">
          {isEdit ? "Save changes" : "Add category"}
        </button>
      </form>
    </Modal>
  );
};

export default AddEditCategoryModal;
