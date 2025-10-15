import { formatDate, isOverdue, getDateRange, isDateInRange, DateRange } from "./dateUtils";
import { DateFilterOption } from "../types/todo";

describe("dateUtils", () => {
  // static system time
  const mockToday = new Date("2025-10-15T00:00:00");
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(mockToday);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // --- formatDate ---
  describe("formatDate", () => {
    it("should format a date string to 'MMM d, yyyy'", () => {
      const result = formatDate("2025-01-05T10:00:00Z");
      expect(result).toBe("Jan 5, 2025"); // 在 en-US locale 下
    });

    it("should handle invalid date string gracefully", () => {
      const result = formatDate("invalid-date");
      expect(typeof result).toBe("string"); // 结果可能为 "Invalid Date"
    });
  });

  // --- isOverdue ---
  describe("isOverdue", () => {
    it("should return false if todo is done", () => {
      expect(isOverdue("2025-01-01", true)).toBe(false);
    });

    it("should return true if due date is before today and not done", () => {
      expect(isOverdue("2025-10-10", false)).toBe(true);
    });

    it("should return false if due date is today or after today", () => {
        expect(isOverdue("2025-10-15T12:00:00", false)).toBe(false);
        expect(isOverdue("2025-10-20T12:00:00", false)).toBe(false);
    });
  });

  // --- getDateRange ---
  describe("getDateRange", () => {
    it("should return today range for 'Today'", () => {
      const range = getDateRange("Today" as DateFilterOption);
      expect(range).not.toBeNull();
      expect(range!.start).toBeInstanceOf(Date);
      expect(range!.end).toBeInstanceOf(Date);
      expect(range!.end.getHours()).toBe(23);
    });

    it("should return week range for 'This Week'", () => {
      const range = getDateRange("This Week" as DateFilterOption);
      expect(range!.start.getDate()).toBe(15);
      expect(range!.end.getDate()).toBeGreaterThanOrEqual(15);
    });

    it("should return month range for 'This Month'", () => {
      const range = getDateRange("This Month" as DateFilterOption);
      expect(range!.end.getDate()).toBeGreaterThan(15);
      expect(range!.end.getHours()).toBe(23);
    });

    it("should return overdue range for 'Overdue'", () => {
      const range = getDateRange("Overdue" as DateFilterOption);
      expect(range!.start.getTime()).toBe(0);
      expect(range!.end.getDate()).toBe(14);
    });

    it("should return custom range when both dates provided", () => {
        const range = getDateRange(
            "Custom" as DateFilterOption,
            "2025-01-01T00:00:00",
            "2025-01-10T00:00:00"
          );
          expect(range!.start.getDate()).toBe(1);
          expect(range!.end.getDate()).toBe(10);
    });

    it("should return null for invalid custom range", () => {
      const range = getDateRange("Custom" as DateFilterOption);
      expect(range).toBeNull();
    });

    it("should return null for 'All' or unknown filter", () => {
      expect(getDateRange("All" as DateFilterOption)).toBeNull();
      expect(getDateRange("Random" as any)).toBeNull();
    });
  });

  // --- isDateInRange ---
  describe("isDateInRange", () => {
    const range: DateRange = {
      start: new Date("2025-10-01"),
      end: new Date("2025-10-31"),
    };

    it("should return true if date within range", () => {
      expect(isDateInRange("2025-10-15", range)).toBe(true);
    });

    it("should return false if date before start", () => {
      expect(isDateInRange("2025-09-30", range)).toBe(false);
    });

    it("should return false if date after end", () => {
      expect(isDateInRange("2025-11-01", range)).toBe(false);
    });
  });
});
