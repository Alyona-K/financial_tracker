import "./CategoryTableHeader.css";

const CategoryTableHeader = () => {
  return (
    <div className="category-table-header">
      <div className="category-table-header__cell">Category Name</div>
      <div className="category-table-header__cell">Type</div>
      <div className="category-table-header__cell">Actions</div>
    </div>
  );
};

export default CategoryTableHeader;