import { formatCurrency } from "./formatCurrency";

const normalize = (str: string) =>
  str.replace(/\s/g, " ").trim(); // унификация пробелов и неразрывных пробелов

describe("formatCurrency", () => {
  describe("formatting correctness", () => {
    it("formats income with + sign and EUR symbol", () => {
      const result = normalize(formatCurrency(1234.5, "Income"));
      expect(result).toMatch(/^\+1\.234,50 €$/);
    });

    it("formats expenses with - sign and EUR symbol", () => {
      const result = normalize(formatCurrency(1234.5, "Expenses"));
      expect(result).toMatch(/^-1\.234,50 €$/);
    });
  });

  describe("edge cases", () => {
    it("handles zero values correctly", () => {
      const income = normalize(formatCurrency(0, "Income"));
      const expense = normalize(formatCurrency(0, "Expenses"));

      expect(income).toBe("+0,00 €");
      expect(expense).toBe("-0,00 €");
    });

    it("handles large numbers with thousand separators", () => {
      const income = normalize(formatCurrency(1234567.89, "Income"));
      expect(income).toMatch(/^\+1\.234\.567,89 €$/);
    });

    it("rounds numbers to two decimal places", () => {
      const result = normalize(formatCurrency(12.3456, "Income"));
      expect(result).toBe("+12,35 €");
    });
  });
});