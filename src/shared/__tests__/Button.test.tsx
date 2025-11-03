import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@shared/ui/Button";

describe("Button component", () => {
  test("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Button className="my-class">Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn my-class");
  });

  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("accepts standard button props", () => {
    render(
      <Button type="submit" disabled>
        Submit
      </Button>
    );
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.type).toBe("submit");
    expect(btn.disabled).toBe(true);
  });
});
