/**
 * @file filterUtils.test.ts
 * Unit tests for filtering and statistics utility functions.
 *
 * These tests validate:
 *  - Todo filtering logic (by state, date, and search text)
 *  - Statistics calculation accuracy
 */

import { applyAllFilters, calculateStats } from "./filterUtils";
import {
  TodoState,
  StateFilterOption,
  DateFilterOption,
} from "../types/todo";

// Mock todos for testing
const mockTodos = [
  {
    taskId: "1",
    userId: "1",
    description: "Finish unit tests",
    dueDate: "2025-10-15",
    state: TodoState.TODO,
    createdAt: "2025-10-10T10:00:00Z",
  },
  {
    taskId: "2",
    userId: "1",
    description: "Write documentation",
    dueDate: "2025-10-14",
    state: TodoState.IN_PROGRESS,
    createdAt: "2025-10-09T09:00:00Z",
  },
  {
    taskId: "3",
    userId: "1",
    description: "Deploy project",
    dueDate: "2025-10-10",
    state: TodoState.DONE,
    createdAt: "2025-10-08T08:00:00Z",
  },
];

describe("📊 calculateStats()", () => {
  test("returns correct counts for each TodoState", () => {
    const stats = calculateStats(mockTodos);

    expect(stats.all).toBe(3);
    expect(stats[TodoState.TODO]).toBe(1);
    expect(stats[TodoState.IN_PROGRESS]).toBe(1);
    expect(stats[TodoState.DONE]).toBe(1);
  });

  test("handles empty list correctly", () => {
    const stats = calculateStats([]);
    expect(stats.all).toBe(0);
    expect(stats[TodoState.TODO]).toBe(0);
    expect(stats[TodoState.IN_PROGRESS]).toBe(0);
    expect(stats[TodoState.DONE]).toBe(0);
  });
});

describe("🔍 applyAllFilters()", () => {
  test("filters by search query (case-insensitive)", () => {
    const filters = {
      searchQuery: "docu", // partial match
      stateFilter: StateFilterOption.ALL,
      dateFilter: DateFilterOption.ALL,
      customDateFrom: "",
      customDateTo: "",
    };

    const result = applyAllFilters(mockTodos, filters);
    expect(result).toHaveLength(1);
    expect(result[0].description).toMatch(/documentation/i);
  });

  test("filters by TodoState", () => {
    const filters = {
      searchQuery: "",
      stateFilter: StateFilterOption.DONE, 
      dateFilter: DateFilterOption.ALL,
      customDateFrom: "",
      customDateTo: "",
    };

    const result = applyAllFilters(mockTodos, filters);
    expect(result).toHaveLength(1);
    expect(result[0].state).toBe(TodoState.DONE);
  });

  test("returns all items when filter = ALL", () => {
    const filters = {
      searchQuery: "",
      stateFilter: StateFilterOption.ALL, 
      dateFilter: DateFilterOption.ALL,   
      customDateFrom: "",
      customDateTo: "",
    };

    const result = applyAllFilters(mockTodos, filters);
    expect(result).toHaveLength(3);
  });

  test("filters by custom date range", () => {
    const filters = {
      searchQuery: "",
      stateFilter: StateFilterOption.ALL,
      dateFilter: DateFilterOption.CUSTOM, // 
      customDateFrom: "2025-10-12",
      customDateTo: "2025-10-16",
    };

    const result = applyAllFilters(mockTodos, filters);
    expect(result).toHaveLength(2); // due 14th and 15th
  });

  test("returns empty array if no todos match filters", () => {
    const filters = {
      searchQuery: "nonexistent",
      stateFilter: StateFilterOption.ALL,
      dateFilter: DateFilterOption.ALL,
      customDateFrom: "",
      customDateTo: "",
    };

    const result = applyAllFilters(mockTodos, filters);
    expect(result).toHaveLength(0);
  });
});
