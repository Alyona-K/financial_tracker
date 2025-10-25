import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  test("should format income correctly", () => {
    expect(formatCurrency(1234.5, "Income")).toBe("+1.234,50 €");
  });

  test("should format expense correctly", () => {
    expect(formatCurrency(1234.5, "Expenses")).toBe("-1.234,50 €");
  });

  test("should handle zero", () => {
    expect(formatCurrency(0, "Income")).toBe("+0,00 €");
    expect(formatCurrency(0, "Expenses")).toBe("-0,00 €");
  });

});
