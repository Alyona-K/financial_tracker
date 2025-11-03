// --- MOCKS ---
// SVG
jest.mock("@/assets/images/sprite.svg", () => "test-file-stub");
// Modal с поддержкой заголовка
jest.mock("@/shared/ui/Modal", () => ({
  __esModule: true,
  default: ({ children, title }: any) => (
    <div data-testid="modal">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));
// Реакт-дейтпикер простой input
jest.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholder }: any) => (
    <input
      data-testid="datepicker"
      value="" // всегда пустое
      placeholder={placeholder}
      onChange={(e) => onChange(null)}
    />
  ),
  registerLocale: jest.fn(),
}));
// Category store
jest.mock("@/entities/category/model/category.store", () => ({
  useCategoriesStore: () => ({ categories: [{ id: "1", name: "Food" }] }),
}));

// CSS
jest.mock("@/shared/ui/DatePickerGlobal.css", () => ({}));
jest.mock("./AddEditTransactionModal.scss", () => ({}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEditTransactionModal from "@/features/transaction/AddEditTransaction/ui/AddEditTransactionModal";
import { FORM_MODE } from "@/shared/config/modes";

describe("AddEditTransactionModal", () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open and shows correct title", () => {
    render(
      <AddEditTransactionModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        mode={FORM_MODE.ADD}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(/Add new transaction/i)).toBeInTheDocument();
  });

  it("shows errors when submitting empty form", async () => {
    render(
      <AddEditTransactionModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        mode={FORM_MODE.ADD}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    // теперь должно быть 5 ошибок (включая дату)
    expect(await screen.findAllByText(/is required/i)).toHaveLength(4);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct data and closes modal", async () => {
    render(
      <AddEditTransactionModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        mode={FORM_MODE.ADD}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your amount/i), {
      target: { value: "100" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter transaction description/i),
      {
        target: { value: "Groceries" },
      }
    );

    fireEvent.click(screen.getByText(/Select category/i));
    fireEvent.click(screen.getByText(/Food/i));

    fireEvent.click(screen.getByText(/Select type/i));
    fireEvent.click(screen.getByText(/Income/i));

    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("fills fields with initialData in edit mode", () => {
    render(
      <AddEditTransactionModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        mode={FORM_MODE.EDIT}
        initialData={{
          id: "1",
          date: "2025-11-03",
          categoryId: "1",
          type: "Expenses",
          amount: 250,
          description: "Taxi",
        }}
      />
    );

    expect(screen.getByDisplayValue("250")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Taxi")).toBeInTheDocument();
    expect(screen.getByText(/Edit transaction/i)).toBeInTheDocument();
  });
});
