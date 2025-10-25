import React from "react";
import sprite from "@/assets/images/sprite.svg";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  label?: string;
  /** Классы для кастомизации */
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  label,
  id,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  iconClassName = "",
  ...props
}) => {
  return (
    <div
      className={`custom-input ${icon ? "custom-input--icon" : ""} ${wrapperClassName}`}
    >
      <input
        className={`custom-input__field ${fieldClassName}`}
        id={id}
        {...props}
      />
      {label && (
        <label className={`custom-input__label ${labelClassName}`} htmlFor={id}>
          <span className="custom-input__label-text">{label}</span>
        </label>
      )}
      {icon && (
        <svg
          className={`custom-input__icon ${iconClassName}`}
          width={24}
          height={24}
          aria-hidden="true"
        >
          <use xlinkHref={`${sprite}#${icon}`} />
        </svg>
      )}
    </div>
  );
};

export default Input;




