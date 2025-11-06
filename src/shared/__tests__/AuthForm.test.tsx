// --- MOCKS ---
jest.mock("@/assets/images/sprite.svg", () => "test-file-stub");
jest.mock("./Input.scss", () => ({}));
jest.mock("./AuthForm.scss", () => ({}));

import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "@shared/ui/AuthForm";

interface FormValues {
  email: string;
  password: string;
}

const fields = [
  { name: "email", label: "Email", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
];

const initialValues: FormValues = { email: "", password: "" };

describe("AuthForm", () => {
  // --- BASIC RENDER TEST FOR FIELDS AND BUTTON ---
  test("renders fields and button", () => {
    render(
      <AuthForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={jest.fn()}
        submitLabel="Submit"
      />
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  // --- REQUIRED FIELDS VALIDATION TEST ---
  test("shows error if required field is empty", async () => {
    const onSubmit = jest.fn();
    render(
      <AuthForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitLabel="Submit"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // --- SUBMIT FORM WITH VALID VALUES TEST ---
  test("calls onSubmit with form values", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <AuthForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitLabel="Submit"
      />
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "123456",
    });
  });

  // --- CUSTOM VALIDATOR ERROR TEST ---
  test("shows custom validation error", async () => {
    const validatorFields = [
      {
        name: "email",
        label: "Email",
        type: "text",
        required: true,
        validator: (value: string) =>
          !value.includes("@") ? "Email must include @" : null,
      },
    ];

    const onSubmit = jest.fn();
    render(
      <AuthForm
        fields={validatorFields}
        initialValues={{ email: "" }}
        onSubmit={onSubmit}
        submitLabel="Submit"
      />
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalidemail" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Email must include @")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // --- PASSWORD TOGGLE VISIBILITY TEST ---
  test("toggles password visibility", () => {
    render(
      <AuthForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={jest.fn()}
        submitLabel="Submit"
      />
    );

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: "" });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  // --- API ERROR DISPLAY TEST ---
  test("displays API error", () => {
    render(
      <AuthForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={jest.fn()}
        submitLabel="Submit"
        apiError="Invalid credentials"
      />
    );

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
