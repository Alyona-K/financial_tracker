import "./Welcome.css";
import Button from "@/shared/ui/Button";

interface WelcomeProps {
  onAddClick: () => void;
}

function Welcome({ onAddClick }: WelcomeProps) {
  return (
    <div className="categories__wrapper">
      <div className="categories__welcome">
        <h2 className="categories__title">Categories</h2>
        <p className="categories__text">
          Manage your categories to better organize your income and expenses. Add
          new categories or edit existing ones as needed.
        </p>
      </div>
      <Button
        className="categories__btn btn btn--large"
        type="button"
        onClick={onAddClick}
      >
        Add category
      </Button>
    </div>
  );
}

export default Welcome;
