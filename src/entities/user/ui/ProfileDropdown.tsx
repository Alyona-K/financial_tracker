import React, { useState } from "react";
import sprite from "@/assets/images/sprite.svg";
import "./ProfileDropdown.css";

interface ProfileOption {
  label: string;
  action: () => void;
}

interface ProfileDropdownProps {
  avatarUrl?: string;
  userName?: string;
  options: ProfileOption[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  avatarUrl,
  userName,
  options,
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

  const handleOptionClick = (opt: ProfileOption) => {
    opt.action();
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  return (
    <div className="profile-dropdown">
      <button
        className="profile-dropdown__btn"
        onClick={handleToggle}
        type="button"
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="profile-dropdown__avatar"
          />
        )}
        <span className="profile-dropdown__name">{userName || "Log in / Register"}</span>
        <svg
          className={`profile-dropdown__arrow ${isOpen && !isClosing ? "open" : ""}`}
          width={22}
          height={22}
        >
          <use xlinkHref={`${sprite}#arrow-down-icon`} />
        </svg>
      </button>

      {(isOpen || isClosing) && (
        <ul
          className={`profile-dropdown__list ${isOpen ? "open" : ""} ${
            isClosing ? "closing" : ""
          }`}
        >
          {options.map((opt) => (
            <li
              key={opt.label}
              className="profile-dropdown__item"
              onClick={() => handleOptionClick(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;





//-----------------------

// import React, { useState, useRef, useEffect } from "react";
// import sprite from "@/assets/images/sprite.svg";
// import "./ProfileDropdown.css";

// interface ProfileOption {
//   label: string;
//   action: () => void;
// }

// interface ProfileDropdownProps {
//   avatarUrl?: string;
//   userName?: string;
//   options: ProfileOption[];
// }

// const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
//   avatarUrl,
//   userName,
//   options,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//  const toggleDropdown = (e: React.MouseEvent) => {
//   e.stopPropagation(); // останавливаем всплытие на document
//   if (isOpen) {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsClosing(false);
//       setIsOpen(false);
//     }, 300);
//   } else {
//     setIsOpen(true);
//   }
// };

//   const closeDropdown = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setIsClosing(false);
//       setIsOpen(false);
//     }, 300);
//   };
//   // Закрытие дропдауна при клике вне компонента
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         closeDropdown();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="profile-dropdown" ref={dropdownRef}>
//       <button className="profile-dropdown__btn" onClick={toggleDropdown} type="button">
//         {avatarUrl && (
//           <img
//             src={avatarUrl}
//             alt="User avatar"
//             className="profile-dropdown__avatar"
//           />
//         )}
//         <span className="profile-dropdown__name">{userName || "Log in / Register"}</span>
//         <svg
//           className={`profile-dropdown__arrow ${isOpen && !isClosing ? "open" : ""}`}
//           width={22}
//           height={22}
//         >
//           <use xlinkHref={`${sprite}#arrow-down-icon`} />
//         </svg>
//       </button>

//       {(isOpen || isClosing) && (
//         <ul className={`profile-dropdown__list ${isOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}>
//           {options.map((opt) => (
//             <li
//               key={opt.label}
//               className="profile-dropdown__item"
//               onClick={() => {
//                 opt.action();
//                 closeDropdown();
//               }}
//             >
//               {opt.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ProfileDropdown;