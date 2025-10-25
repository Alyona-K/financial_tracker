import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sprite from "@/assets/images/sprite.svg";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import "./WidgetCard.css";

export type WidgetCardType = "income" | "expenses" | "balance";

export interface WidgetCardProps {
  iconId: string;
  title: string;
  amount: number;
  changePercent: number;
  cardType: WidgetCardType;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  iconId,
  title,
  amount,
  changePercent,
  cardType,
  isMenuOpen,
  onToggleMenu,
}) => {
  const formattedAmount =
    cardType === "balance"
      ? new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        }).format(amount)
      : formatCurrency(amount, cardType === "income" ? "Income" : "Expenses");

  const change = `${changePercent > 0 ? "+" : ""}${changePercent}%`;
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Управляем маунтом и анимацией
  useEffect(() => {
    if (isMenuOpen) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateOpen(true));
    } else {
      setAnimateOpen(false);
      const timeout = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpen]);

  // Клик вне меню и закрытие по Esc
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".widget-card__menu-btn")
      ) {
        onToggleMenu();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggleMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen, onToggleMenu]);

  const handleViewDetails = () => {
    navigate("/transactions");
    onToggleMenu();
  };

  const handleExportCSV = () => {
    alert(`Exporting ${title} to CSV...`);
    onToggleMenu();
  };

  return (
    <div className={`widget-card widget-card--${cardType}`}>
      <div className="widget-card__left">
        <div className="widget-card__icon">
          <svg width={28} height={28}>
            <use xlinkHref={`${sprite}#${iconId}`} />
          </svg>
        </div>
        <div className="widget-card__title">{title}</div>
        <div className="widget-card__amount">{formattedAmount}</div>
      </div>

      <div className="widget-card__right">
        <button
          className="widget-card__menu-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
        >
          <svg className="widget-card__menu-icon" width={22} height={22}>
            <use xlinkHref={`${sprite}#widget-burger-icon`} />
          </svg>
        </button>

        {mounted && (
          <div
            ref={menuRef}
            className={`widget-card__menu-dropdown ${animateOpen ? "open" : ""}`}
            role="menu"
          >
            <button
              onClick={handleViewDetails}
              className="widget-card__menu-dropdown-btn"
              role="menuitem"
            >
              View details
            </button>
            <button
              onClick={handleExportCSV}
              className="widget-card__menu-dropdown-btn"
              role="menuitem"
            >
              Export as CSV
            </button>
          </div>
        )}

        <span className="widget-card__change">{change}</span>
      </div>
    </div>
  );
};
