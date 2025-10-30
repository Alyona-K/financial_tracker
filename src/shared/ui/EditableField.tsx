import { useState } from "react";
import sprite from "@/assets/images/sprite.svg";
import type { User } from "@/entities/user/model/user.types";
import "./EditableField.css";

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

//--------------------------------

// import { useState } from "react";
// import sprite from "@/assets/images/sprite.svg";
// import type { User } from "@/entities/user/model/user.types";
// import "./EditableField.css";

// type EditableFieldProps = {
//   label: string;
//   value: string;
//   field: keyof User;
//   onSave: (field: keyof User, value: string) => Promise<void>;
//   isPassword?: boolean;
// };

// export function EditableField({
//   label,
//   value,
//   field,
//   onSave,
//   isPassword,
// }: EditableFieldProps) {
//   const [editing, setEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSave = async () => {
//     if (inputValue === value) {
//       setEditing(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       await onSave(field, inputValue);
//       setEditing(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="editable-field">
//       <span className="editable-field__label">{label}:</span>{" "}
//       {editing ? (
//         <span className="editable-field__input-wrapper">
//           <input
//             className="editable-field__field"
//             type={isPassword && !showPassword ? "password" : "text"}
//             value={inputValue}
//             autoFocus
//             disabled={loading}
//             onChange={(e) => setInputValue(e.target.value)}
//             onBlur={handleSave}
//             onKeyDown={(e) => e.key === "Enter" && handleSave()}
//           />
//           {isPassword && (
//             <button
//               type="button"
//               className="editable-field__toggle"
//               onMouseDown={(e) => e.preventDefault()} // не теряем фокус
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               <svg
//                 className="editable-field__show-icon"
//                 width={16}
//                 height={16}
//                 aria-hidden="true"
//               >
//                 <use
//                   xlinkHref={`${sprite}#${showPassword ? "eye-off-icon" : "eye-icon"}`}
//                 />
//               </svg>
//             </button>
//           )}
//         </span>
//       ) : (
//         <div className="editable-field__value-wrap">
//           <span className="editable-field__value">
//             {isPassword ? "••••••" : value || "—"}{" "}
//           </span>
//           <svg
//             className="editable-field__edit-icon"
//             onClick={() => setEditing(true)}
//             width={14}
//             height={13}
//             aria-hidden="true"
//           >
//             <use xlinkHref={`${sprite}#edit-icon`} />
//           </svg>
//         </div>
//       )}
//     </div>
//   );
// }

//------------------------

// import { useState } from "react";
// import Input from "@/shared/ui/Input";
// import "@/shared/ui/Input.css";
// import sprite from "@/assets/images/sprite.svg";
// import type { User } from "@/entities/user/model/user.types";
// import "./EditableField.css";

// type EditableFieldProps = {
//   label: string;
//   value: string;
//   field: keyof User;
//   onSave: (field: keyof User, value: string) => Promise<void>;
//   isPassword?: boolean;
// };

// export function EditableField({
//   label,
//   value,
//   field,
//   onSave,
//   isPassword,
// }: EditableFieldProps) {
//   const [editing, setEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSave = async () => {
//     if (inputValue === value) {
//       setEditing(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       await onSave(field, inputValue);
//       setEditing(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="editable-field">
//       {editing ? (
//         <div className="editable-field__edit-wrapper">
//           <Input
//             label={label}
//             type={isPassword && !showPassword ? "password" : "text"}
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onBlur={handleSave}
//             autoFocus
//             disabled={loading}
//             wrapperClassName="editable-field__input-wrap"
//             fieldClassName="editable-field__field"
//             labelClassName="editable-field__label"
//           />
//           {isPassword && (
//             <button
//               type="button"
//               className="editable-field__toggle"
//               onMouseDown={(e) => e.preventDefault()} // не теряем фокус с инпута
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               <svg
//                 className="editable-field__icon"
//                 width={16}
//                 height={16}
//                 aria-hidden="true"
//               >
//                 <use
//                   xlinkHref={`${sprite}#${showPassword ? "eye-off-icon" : "eye-icon"}`}
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="editable-field__display">

//             <span className="editable-field__label">{label}:</span>{" "}
//             <div className="editable-field__value-wrap">
//             <span className="editable-field__value">
//               {isPassword ? "••••••" : value || "—"}
//             </span>

//           <button
//             type="button"
//             className="editable-field__button"
//             onClick={() => setEditing(true)}
//           >
//             <svg
//               className="editable-field__icon"
//               width={14}
//               height={13}
//               aria-hidden="true"
//             >
//               <use xlinkHref={`${sprite}#edit-icon`} />
//             </svg>
//           </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
