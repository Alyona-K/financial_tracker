// import { useState, useEffect } from "react";

// interface UseDropdownFieldProps<T> {
//   options: T[]; // массив объектов (например, категории)
//   valueKey: keyof T; // ключ для отображаемого значения (name)
//   idKey: keyof T; // ключ для id
//   initialId?: string;
//   onChange?: (selectedId: string) => void;
// }

// export function useDropdownField<T extends Record<string, any>>({
//   options,
//   valueKey,
//   idKey,
//   initialId,
//   onChange,
// }: UseDropdownFieldProps<T>) {
//   const [selectedId, setSelectedId] = useState(initialId || "");
//   const selectedValue =
//     options.find((o) => o[idKey] === selectedId)?.[valueKey] || "";

//   const handleChange = (value: string) => {
//     const selected = options.find((o) => o[valueKey] === value);
//     if (selected) {
//       setSelectedId(selected[idKey]);
//       onChange?.(selected[idKey]);
//     }
//   };

//   useEffect(() => {
//     if (initialId) setSelectedId(initialId);
//   }, [initialId]);

//   return { selectedValue, selectedId, handleChange, setSelectedId };
// }
