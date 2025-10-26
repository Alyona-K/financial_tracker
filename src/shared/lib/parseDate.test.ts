import { parseDate } from "./parseDate";

describe("parseDate", () => {
  it("parses a valid YYYY-MM-DD string correctly", () => {
    const result = parseDate("2025-10-12");
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9); // October = 9
    expect(result?.getDate()).toBe(12);
  });

  it("handles single-digit month and day", () => {
    const result = parseDate("2025-1-5");
    expect(result).toBeInstanceOf(Date);
    expect(result?.getMonth()).toBe(0); // January
    expect(result?.getDate()).toBe(5);
  });

  it("returns null for empty string", () => {
    expect(parseDate("")).toBeNull();
  });

  it("returns null for invalid delimiters or formats", () => {
    expect(parseDate("2025/10/12")).toBeNull();
    expect(parseDate("2025.10.12")).toBeNull();
    expect(parseDate("10-12-2025")).toBeNull();
    expect(parseDate("invalid")).toBeNull();
  });

  it("returns null for malformed date components", () => {
    // пустая строка или неполная дата
    expect(parseDate("2025-")).toBeNull();

    // месяц вне диапазона
    expect(parseDate("2025-13-01")).toBeNull();
    expect(parseDate("2025-00-15")).toBeNull();

    // день вне диапазона
    expect(parseDate("2025-02-30")).toBeNull(); // JS бы прокрутил в марте
  });
});
