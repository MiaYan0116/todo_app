/**
 * Pure utility functions for date operations
 * 
 * Purpose: Encapsulate all date-related logic in pure, testable functions
 * Benefits: No React dependencies, easily testable, reusable across application
 * Pattern: Functional programming - pure functions with no side effects
 */

import { DateFilterOption } from "../types/todo";

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Formats a date string to localized format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

/**
 * Checks if a todo is overdue based on due date and completion status
 */
export function isOverdue(dueDate: string, isDone: boolean): boolean {
  if (isDone) return false;
  
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return due < today;
}

/**
 * Calculates date range based on filter option
 * Returns null if filter is "All" or invalid custom range
 */
export function getDateRange(
  filter: DateFilterOption,
  customFrom?: string,
  customTo?: string
): DateRange | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filter) {
    case "Today": {
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      return { start: today, end: endOfDay };
    }

    case "This Week": {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      return { start: today, end: endOfWeek };
    }

    case "This Month": {
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return { start: today, end: endOfMonth };
    }

    case "Overdue": {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      return { start: new Date(0), end: yesterday };
    }

    case "Custom": {
      if (customFrom && customTo) {
        const start = new Date(customFrom);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customTo);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Checks if a date falls within a date range
 */
export function isDateInRange(date: string, range: DateRange): boolean {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= range.start && checkDate <= range.end;
}
