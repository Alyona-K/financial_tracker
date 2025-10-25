import { parseDate } from "./parseDate";

describe("parseDate", () => {
  test("should parse valid date string", () => {
    const result = parseDate("2025-10-12");
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2025);
    expect(result?.getMonth()).toBe(9); // октябрь = 9, потому что JS months 0-indexed
    expect(result?.getDate()).toBe(12);
  });

  test("should return null for empty string", () => {
    expect(parseDate("")).toBeNull();
  });

  test("should return null for invalid format", () => {
    expect(parseDate("2025-10-12")).toEqual(new Date(2025, 9, 12));
    expect(parseDate("2025/10/12")).toBeNull();
    expect(parseDate("invalid")).toBeNull();
  });

  test("should handle single-digit month/day", () => {
    const result = parseDate("2025-1-5");
    expect(result?.getMonth()).toBe(0); // январь
    expect(result?.getDate()).toBe(5);
  });
});
