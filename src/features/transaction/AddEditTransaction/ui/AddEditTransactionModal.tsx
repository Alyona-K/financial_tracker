import React, { useState, useEffect, useRef } from "react";
import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import { useCategoriesStore } from "@/entities/category/model/category.store";
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import sprite from "@/assets/images/sprite.svg";
import Dropdown from "@/shared/ui/Dropdown";
import { TransactionFormData } from "@/entities/transaction/model/transaction.types";
import { FORM_MODE } from "@/shared/config/modes";
import "react-datepicker/dist/react-datepicker.css";
import "@/shared/ui/DatePickerGlobal.css";
import "./AddEditTransactionModal.css";

registerLocale("en-GB", enGB);

interface AddEditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  mode: FORM_MODE;
  initialData?: TransactionFormData;
}

interface TransactionFormUI {
  id?: string;
  date: string;
  categoryId: string;
  type: string;
  amount: string;
  description: string;
}

const TYPE_OPTIONS = ["Income", "Expenses"];

const AddEditTransactionModal: React.FC<AddEditTransactionModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
}) => {
  const isEdit = mode === FORM_MODE.EDIT;

  const { categories, fetchCategories } = useCategoriesStore();

  const [form, setForm] = useState<TransactionFormUI>({
    date: "",
    categoryId: "",
    type: "",
    amount: "",
    description: "",
    id: undefined,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"category" | "type" | null>(
    null
  );
  const datepickerRef = useRef<HTMLDivElement>(null);

  // --- RESET FORM ON OPEN ---
  useEffect(() => {
    if (isOpen) {
      setForm({
        date: initialData?.date || new Date().toISOString().slice(0, 10),
        categoryId: initialData?.categoryId || "",
        type: initialData?.type || "",
        amount: initialData?.amount?.toString() || "",
        description: initialData?.description || "",
        id: initialData?.id,
      });
      setErrors({});
      setOpenDropdown(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof TransactionFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearDate = () => setForm((prev) => ({ ...prev, date: "" }));

  const toggleDropdown = (key: "category" | "type") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};
    if (!form.date) newErrors.date = "Date is required";
    if (!form.categoryId) newErrors.categoryId = "Category is required";
    if (!form.type) newErrors.type = "Type is required";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Amount is required and must be greater than 0";
    if (!form.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const transactionToSave: TransactionFormData = {
      id: form.id,
      date: form.date,
      categoryId: form.categoryId,
      type: form.type as "Income" | "Expenses",
      amount: Number(form.amount),
      description: form.description,
    };

    try {
      if (onSubmit) await onSubmit(transactionToSave); // <--- вызываем пропс
      onClose(); // закрываем модалку после выполнения onSubmit
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit transaction" : "Add new transaction"}
    >
      <form className="add-edit-transaction-form" onSubmit={handleSubmit}>
        {/* DATE */}
        <div
          ref={datepickerRef}
          className="add-edit-transaction-form__datepicker-wrap"
        >
          <label className="add-edit-transaction-form__datepicker-label">
            Date
          </label>
          <ReactDatePicker
            selected={form.date ? new Date(form.date) : null}
            onChange={(date: Date | null) => {
              handleChange("date", date ? date.toISOString().slice(0, 10) : "");
              setIsCalendarOpen(false);
            }}
            open={isCalendarOpen}
            onInputClick={() => setIsCalendarOpen((prev) => !prev)}
            onClickOutside={() => setIsCalendarOpen(false)}
            dateFormat="dd-MM-yyyy"
            placeholderText={new Date().toISOString().slice(0, 10)}
            className="add-edit-transaction-form__datepicker-input"
            locale="en-GB"
            calendarStartDay={1}
            shouldCloseOnSelect={true}
            
          />
          <svg
            className={`add-edit-transaction-form__datepicker-calendar-icon ${
              isCalendarOpen || form.date ? "visible" : ""
            }`}
            width={24}
            height={24}
            onClick={handleClearDate}
          >
            <use xlinkHref={`${sprite}#calendar-icon`} />
          </svg>
          {errors.date && (
            <span className="add-edit-transaction-form__form-error">
              {errors.date}
            </span>
          )}
        </div>

        {/* CATEGORY */}
        <div className="add-edit-transaction-form__select">
          <Dropdown
            label="Category"
            placeholder="Select category"
            options={categories.map((c) => c.name)}
            value={
              form.categoryId
                ? categories.find((c) => c.id === form.categoryId)?.name || ""
                : ""
            }
            onChange={(selected) => {
              const cat = categories.find((c) => c.name === selected);
              handleChange("categoryId", cat?.id || "");
            }}
            showAllOption={false}
            wrapperClassName="add-edit-transaction-form__dropdown-wrapper"
            buttonClassName="add-edit-transaction-form__dropdown-btn"
            listClassName="add-edit-transaction-form__dropdown-list"
            itemClassName="add-edit-transaction-form__dropdown-item"
            labelClassName="add-edit-transaction-form__dropdown-label"
            isOpen={openDropdown === "category"}
            onToggle={() => toggleDropdown("category")}
            onClose={closeDropdown}
          />
          {errors.categoryId && (
            <span className="add-edit-transaction-form__form-error">
              {errors.categoryId}
            </span>
          )}
        </div>

        {/* TYPE */}
        <div className="add-edit-transaction-form__select">
          <Dropdown
            label="Type"
            placeholder="Select type"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={(selected) => handleChange("type", selected)}
            showAllOption={false}
            wrapperClassName="add-edit-transaction-form__dropdown-wrapper"
            buttonClassName="add-edit-transaction-form__dropdown-btn"
            listClassName="add-edit-transaction-form__dropdown-list"
            itemClassName="add-edit-transaction-form__dropdown-item"
            labelClassName="add-edit-transaction-form__dropdown-label"
            isOpen={openDropdown === "type"}
            onToggle={() => toggleDropdown("type")}
            onClose={closeDropdown}
          />
          {errors.type && (
            <span className="add-edit-transaction-form__form-error">
              {errors.type}
            </span>
          )}
        </div>

        {/* AMOUNT */}
        <div className="add-edit-transaction-form__amount">
          <Input
            label="Amount"
            type="number"
            placeholder="Enter your amount"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            wrapperClassName="add-edit-transaction-form__amount-wrap"
            labelClassName="add-edit-transaction-form__amount-label"
            fieldClassName="add-edit-transaction-form__amount-field"
          />
          {errors.amount && (
            <span className="add-edit-transaction-form__form-error">
              {errors.amount}
            </span>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="add-edit-transaction-form__description">
          <Textarea
            label="Description"
            placeholder="Enter transaction description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            wrapperClassName="add-edit-transaction-form__amount-wrap"
            labelClassName="add-edit-transaction-form__amount-label"
            fieldClassName="add-edit-transaction-form__amount-field"
          />
          {errors.description && (
            <span className="add-edit-transaction-form__form-error">
              {errors.description}
            </span>
          )}
        </div>

        <button type="submit" className="btn">
          {isEdit ? "Save changes" : "Add transaction"}
        </button>
      </form>
    </Modal>
  );
};

export default AddEditTransactionModal;
