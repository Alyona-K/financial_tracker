import "./SectionHeader.scss";

interface SectionHeaderProps {
  title: string;
  text: string;
  children?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  text,
  children,
  className = "",
}) => {
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header__top">
        <h2 className="section-header__title">{title}</h2>
        <p className="section-header__text">{text}</p>
      </div>
      {children && <div className="section-header__bottom">{children}</div>}
    </div>
  );
};

export default SectionHeader;
