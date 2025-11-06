import { formatDate } from "./formatDate";

describe("formatDate", () => {
  // --- VALID DATE FORMATTING ---
  it("formats valid date string to short US format", () => {
    const result = formatDate("2025-10-12");
    expect(result).toMatch(/^Oct 12, 2025$/);
  });

  // --- SINGLE-DIGIT MONTH/DAY ---
  it("handles single-digit month and day", () => {
    const result = formatDate("2025-1-5");
    expect(result).toMatch(/^Jan 5, 2025$/);
  });

  // --- INVALID OR MALFORMED INPUT ---
  it("returns empty string for invalid, empty, or malformed input", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("invalid")).toBe("");
    expect(formatDate("2025/10/12")).toBe("");
  });

  // --- NULL OR UNDEFINED INPUT ---
  it("returns empty string for null or undefined", () => {
    expect(formatDate(null as any)).toBe("");
    expect(formatDate(undefined as any)).toBe("");
  });

  // --- LEAP YEAR HANDLING ---
  it("handles leap year correctly", () => {
    expect(formatDate("2024-02-29")).toBe("Feb 29, 2024");
    expect(formatDate("2025-02-28")).toBe("Feb 28, 2025");
  });

  // --- EDGE YEAR BOUNDARIES ---
  it("handles edge year boundaries within JS Date limits", () => {
    expect(formatDate("1970-01-01")).toBe("Jan 1, 1970");
    expect(formatDate("9999-12-31")).toBe("Dec 31, 9999");
  });
});
