/**
 * Core domain types for the TODO application
 * 
 * Purpose: Centralize all type definitions for type safety and reusability
 * Benefits: Single source of truth, prevents type duplication, easier refactoring
 */

export type TodoState = "TODO" | "In Progress" | "Done";

export interface Todo {
  taskId: string;
  userId: string;
  description: string;
  dueDate: string; // ISO date string format
  state: TodoState;
}

export type ViewMode = "list" | "grid";

export type DateFilterOption = "All" | "Today" | "This Week" | "This Month" | "Overdue" | "Custom";

export type StateFilterOption = "All" | TodoState;

export interface TodoFilters {
  searchQuery: string;
  stateFilter: StateFilterOption;
  dateFilter: DateFilterOption;
  customDateFrom: string;
  customDateTo: string;
}

export interface TodoStats {
  all: number;
  todo: number;
  inProgress: number;
  done: number;
}
