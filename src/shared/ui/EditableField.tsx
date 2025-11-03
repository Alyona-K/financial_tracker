import { useState } from "react";
import sprite from "@/assets/images/sprite.svg";
import type { User } from "@/entities/user/model/user.types";
import "./EditableField.scss";

type EditableFieldProps = {
  label: string;
  value: string;
  field: keyof User;
  onSave: (field: keyof User, value: string) => Promise<void>;
  readOnly?: boolean;
};

export function EditableField({
  label,
  value,
  field,
  onSave,
  readOnly,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (inputValue === value) {
      setEditing(false);
      return;
    }
    try {
      setLoading(true);
      await onSave(field, inputValue);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editable-field">
      <span className="editable-field__label">{label}:</span>{" "}
      {editing ? (
        <span className="editable-field__input-wrapper">
          <input
            className="editable-field__field"
            type="text"
            value={inputValue}
            autoFocus
            disabled={loading}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </span>
      ) : (
        <div className="editable-field__value-wrap">
          <span className="editable-field__value">{value || "—"}</span>
          {!readOnly && (
            <svg
              className="editable-field__edit-icon"
              onClick={() => setEditing(true)}
              width={14}
              height={13}
              aria-hidden="true"
            >
              <use xlinkHref={`${sprite}#edit-icon`} />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
