import React from "react";
import "./Textarea.css";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  ...props
}) => {
  return (
    <div className={`custom-textarea ${wrapperClassName}`}>
      <textarea
        className={`custom-textarea__field ${fieldClassName}`}
        id={id}
        {...props}
      />
      {label && (
        <label className={`custom-textarea__label ${labelClassName}`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Textarea;
