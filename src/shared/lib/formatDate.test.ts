import { formatDate } from "./formatDate";

describe("formatDate", () => {
  test("should format valid date string", () => {
    expect(formatDate("2025-10-12")).toBe("Oct 12, 2025");
  });

  test("should return empty string for invalid date", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("invalid")).toBe("");
  });

  test("should return empty string for null/undefined", () => {
    expect(formatDate("")).toBe("");
  });
});
