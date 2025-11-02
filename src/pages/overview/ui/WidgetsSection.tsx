import { WidgetCard } from "@/shared/ui/WidgetCard";
import { useWidgetsStore } from "@/entities/widget/model/widget.store";
import "./WidgetsSection.scss";

export const WidgetsSection = () => {
  const { widgets, openMenuId, setOpenMenuId } = useWidgetsStore();

  const handleToggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
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
