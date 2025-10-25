import { useState } from "react";
import { WidgetCard } from "@/shared/ui/WidgetCard";
import { useWidgetsData } from "@/shared/hooks/useWidgetsData";
import "./WidgetsSection.css";

export const WidgetsSection = () => {
  const { widgets } = useWidgetsData();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleToggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="widgets">
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          iconId={widget.iconId}
          title={widget.title}
          amount={widget.amount}
          changePercent={widget.changePercent}
          cardType={widget.cardType}
          isMenuOpen={openMenuId === widget.id}
          onToggleMenu={() => handleToggleMenu(widget.id)}
        />
      ))}
    </div>
  );
};

export default WidgetsSection;
