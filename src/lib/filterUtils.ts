/**
 * Pure utility functions for filtering todos
 * 
 * Purpose: Extract filtering logic into pure, composable functions
 * Benefits: Testable, reusable, follows single responsibility principle
 * Pattern: Functional composition - combine simple filters into complex ones
 */

import { Todo, TodoFilters, TodoStats } from "../types/todo";
import { getDateRange, isDateInRange } from "./dateUtils";

/**
 * Filters todos based on search query (description or userId)
 */
export function filterBySearch(todos: Todo[], query: string): Todo[] {
  if (!query) return todos;
  
  const lowerQuery = query.toLowerCase();
  return todos.filter(
    (todo) =>
      todo.description.toLowerCase().includes(lowerQuery) ||
      todo.userId.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filters todos based on state
 */
export function filterByState(todos: Todo[], state: string): Todo[] {
  if (state === "All") return todos;
  return todos.filter((todo) => todo.state === state);
}

/**
 * Filters todos based on date range
 */
export function filterByDate(
  todos: Todo[],
  dateFilter: string,
  customFrom?: string,
  customTo?: string
): Todo[] {
  if (dateFilter === "All") return todos;

  const dateRange = getDateRange(dateFilter as any, customFrom, customTo);
  if (!dateRange) return todos;

  let filtered = todos.filter((todo) => isDateInRange(todo.dueDate, dateRange));

  // Special case: Overdue filter should exclude completed tasks
  if (dateFilter === "Overdue") {
    filtered = filtered.filter((todo) => todo.state !== "Done");
  }

  return filtered;
}

/**
 * Applies all filters to a todo list
 * Main filtering orchestration function
 */
export function applyAllFilters(todos: Todo[], filters: TodoFilters): Todo[] {
  let result = todos;
  
  // Apply filters in sequence (composition pattern)
  result = filterBySearch(result, filters.searchQuery);
  result = filterByState(result, filters.stateFilter);
  result = filterByDate(
    result,
    filters.dateFilter,
    filters.customDateFrom,
    filters.customDateTo
  );
  
  return result;
}

/**
 * Calculates statistics from todo list
 */
export function calculateStats(todos: Todo[]): TodoStats {
  return {
    all: todos.length,
    todo: todos.filter((t) => t.state === "TODO").length,
    inProgress: todos.filter((t) => t.state === "In Progress").length,
    done: todos.filter((t) => t.state === "Done").length,
  };
}
