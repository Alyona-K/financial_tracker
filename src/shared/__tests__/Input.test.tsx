import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@shared/ui/Input";

jest.mock("@/assets/images/sprite.svg", () => "sprite-mock");

describe("Input component", () => {
  test("renders input with label", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  test("accepts user input", () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Alice" } });
    expect(input.value).toBe("Alice");
  });

  test("sets the correct type", () => {
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
  });
});
