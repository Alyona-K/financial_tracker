import { formatCurrency } from "./formatCurrency";

// --- UTILITY FUNCTION TO CLEAN STRINGS ---
const normalize = (str: string) =>
  str.replace(/\s/g, " ").trim(); 

describe("formatCurrency", () => {
  describe("formatting correctness", () => {
    // --- CHECKS POSITIVE INCOME FORMATTING ---
    it("formats income with + sign and EUR symbol", () => {
      const result = normalize(formatCurrency(1234.5, "Income"));
      expect(result).toMatch(/^\+1\.234,50 €$/);
    });

    // --- CHECKS NEGATIVE EXPENSE FORMATTING ---
    it("formats expenses with - sign and EUR symbol", () => {
      const result = normalize(formatCurrency(1234.5, "Expenses"));
      expect(result).toMatch(/^-1\.234,50 €$/);
    });
  });

  describe("edge cases", () => {
    // --- EDGE CASE: ZERO VALUE FORMATTING ---
    it("handles zero values correctly", () => {
      const income = normalize(formatCurrency(0, "Income"));
      const expense = normalize(formatCurrency(0, "Expenses"));

      expect(income).toBe("+0,00 €");
      expect(expense).toBe("-0,00 €");
    });

    // --- CHECKS LARGE NUMBER FORMATTING ---
    it("handles large numbers with thousand separators", () => {
      const income = normalize(formatCurrency(1234567.89, "Income"));
      expect(income).toMatch(/^\+1\.234\.567,89 €$/);
    });

    // --- CHECKS ROUNDING TO 2 DECIMALS ---
    it("rounds numbers to two decimal places", () => {
      const result = normalize(formatCurrency(12.3456, "Income"));
      expect(result).toBe("+12,35 €");
    });
  });
});