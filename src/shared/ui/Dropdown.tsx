import React, { useState } from "react";
import sprite from "@/assets/images/sprite.svg";
import "./Dropdown.scss";

type DropdownProps = {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  width?: string | number;
  wrapperClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  showAllOption?: boolean;
  labelClassName?: string;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  buttonClassName,
  iconClassName,
  listClassName,
  itemClassName,
  showAllOption = true,
  labelClassName,
  placeholder,
  isOpen,
  onToggle,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    } else {
      onToggle();
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    onClose();
  };

  return (
    <div className={`dropdown__wrapper ${wrapperClassName}`}>
      {/* Внешний label */}
      {label && (
        <span className={`dropdown__label ${labelClassName}`}>{label}</span>
      )}

      {/* Кнопка для открытия списка */}
      <button
        type="button"
        className={`dropdown__btn ${buttonClassName}`}
        // onClick={toggleDropdown}
        onClick={handleToggle}
      >
        <span className="dropdown__button-text">{value || placeholder}</span>
        <svg
          className={`dropdown__arrow-icon ${iconClassName} ${
            isOpen && !isClosing ? "open" : ""
          }`}
          width={24}
          height={20}
        >
          <use xlinkHref={`${sprite}#arrow-down-icon`} />
        </svg>
      </button>

      {(isOpen || isClosing) && (
        <ul
          className={`dropdown__list ${listClassName} ${
            isOpen ? "open" : ""
          } ${isClosing ? "closing" : ""}`}
        >
          {showAllOption && (
            <li
              className={`dropdown__item ${itemClassName}`}
              onClick={() => handleSelect("")}
            >
              All
            </li>
          )}
          {options.map((opt) => (
            <li
              className={`dropdown__item ${itemClassName}`}
              key={opt}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
