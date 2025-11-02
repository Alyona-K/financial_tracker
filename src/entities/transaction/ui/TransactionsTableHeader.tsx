import React, { useState } from "react";
import { Transaction } from "@/entities/transaction/model/transaction.types";
import sprite from "@/assets/images/sprite.svg";
import Dropdown from "@/shared/ui/Dropdown";
import "./TransactionsTableHeader.scss";

type TransactionsTableHeaderProps = {
  onSort: (field: keyof Transaction, direction: "asc" | "desc") => void;
  onFilterCategory: (category: string) => void;
  onFilterType: (type?: "Income" | "Expenses") => void;
  categories: string[];
};

const TransactionsTableHeader: React.FC<TransactionsTableHeaderProps> = ({
  onSort,
  onFilterCategory,
  onFilterType,
  categories,
}) => {
  const [sortState, setSortState] = useState<{
    field: keyof Transaction | null;
    direction: "asc" | "desc";
  }>({
    field: null,
    direction: "asc",
  });

  // контролируем, какой дропдаун открыт
  const [openDropdown, setOpenDropdown] = useState<"category" | "type" | null>(null);

  const handleSort = (field: keyof Transaction) => {
    const newDirection =
      sortState.field === field && sortState.direction === "asc"
        ? "desc"
        : "asc";
    setSortState({ field, direction: newDirection });
    onSort(field, newDirection);
  };

  return (
    <div className="transactions-table__header">
      {/* DATE */}
      <div className="transactions-table__cell">
        <span className="transactions-table__cell-name">Date</span>
        <button
          className="transactions-table__btn"
          onClick={() => handleSort("date")}
        >
          <svg
            className={`transactions-table__icon ${
              sortState.field === "date"
                ? sortState.direction === "asc"
                  ? "asc"
                  : "desc"
                : ""
            }`}
            width={22}
            height={22}
          >
            <use xlinkHref={`${sprite}#sorting-arrows-icon`} />
          </svg>
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="transactions-table__cell">
        <span className="transactions-table__cell-name">Description</span>
      </div>

      {/* CATEGORY */}
      <div className="transactions-table__cell">
        <Dropdown
          placeholder="Category"
          options={categories}
          value=""
          onChange={(val) => onFilterCategory(val)}
          showAllOption={true}
          isOpen={openDropdown === "category"}
          onToggle={() =>
            setOpenDropdown(openDropdown === "category" ? null : "category")
          }
          onClose={() => setOpenDropdown(null)}
        />
      </div>

      {/* TYPE */}
      <div className="transactions-table__cell">
        <Dropdown
          placeholder="Type"
          options={["Income", "Expenses"]}
          value=""
          onChange={(val) =>
            onFilterType(val === "All" ? undefined : (val as "Income" | "Expenses"))
          }
          showAllOption={true}
          isOpen={openDropdown === "type"}
          onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
          onClose={() => setOpenDropdown(null)}
        />
      </div>

      {/* AMOUNT */}
      <div className="transactions-table__cell">
        <span className="transactions-table__cell-name">Amount</span>
        <button
          className="transactions-table__btn"
          onClick={() => handleSort("amount")}
        >
          <svg
            className={`transactions-table__icon ${
              sortState.field === "amount"
                ? sortState.direction === "asc"
                  ? "asc"
                  : "desc"
                : ""
            }`}
            width={22}
            height={22}
          >
            <use xlinkHref={`${sprite}#sorting-arrows-icon`} />
          </svg>
        </button>
      </div>

      {/* ACTIONS */}
      <div className="transactions-table__cell">
        <span className="transactions-table__cell-name">Actions</span>
      </div>
    </div>
  );
};

export default TransactionsTableHeader;

