import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats valid date string to short US format", () => {
    const result = formatDate("2025-10-12");
    expect(result).toMatch(/^Oct 12, 2025$/); // Проверяем общий формат, не зависящий от среды
  });

  it("handles single-digit month and day", () => {
    const result = formatDate("2025-1-5");
    expect(result).toMatch(/^Jan 5, 2025$/);
  });

  it("returns empty string for invalid, empty, or malformed input", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("invalid")).toBe("");
    expect(formatDate("2025/10/12")).toBe("");
  });

  it("returns empty string for null or undefined", () => {
    expect(formatDate(null as any)).toBe("");
    expect(formatDate(undefined as any)).toBe("");
  });

  it("handles leap year correctly", () => {
    expect(formatDate("2024-02-29")).toBe("Feb 29, 2024"); // валидная дата
    expect(formatDate("2025-02-28")).toBe("Feb 28, 2025"); // корректно вместо Feb 29, 2025
  });

  it("handles edge year boundaries within JS Date limits", () => {
    // Минимальный год, который безопасно использовать в JS Date
    expect(formatDate("1970-01-01")).toBe("Jan 1, 1970");
    // Максимальный год, который безопасно использовать
    expect(formatDate("9999-12-31")).toBe("Dec 31, 9999");
  });
});
