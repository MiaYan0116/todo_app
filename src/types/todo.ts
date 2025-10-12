/**
 * todo.ts
 * -------------------------------------
 * Domain model definitions for the TODO application.
 * Using TypeScript enums for consistent, type-safe status and option handling.
 */


/**
 * Lifecycle state of a TODO item.
 * Used for filtering, rendering, and progress tracking.
 */
export enum TodoState {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

/**
 * Layout mode for displaying todos.
 * Controls list vs. grid presentation in the UI.
 */
export enum ViewMode {
  LIST = "list",
  GRID = "grid",
}

/**
 * Represents a single TODO record.
 */
export interface Todo {
  taskId: string;
  userId: string;
  description: string;
  dueDate: string; // ISO date string format
  state: TodoState;
  // createdAt: string;    // ISO string (stored)
  // updatedAt?: string;   // optional ISO string
}

/**
 * Date-based filtering categories.
 * Enables quick filtering for common time ranges.
 */
export enum DateFilterOption {
  ALL = "All",
  TODAY = "Today",
  THIS_WEEK = "This Week",
  THIS_MONTH = "This Month",
  OVERDUE = "Overdue",
  CUSTOM = "Custom",
}

/**
 * Filtering options by task state.
 * Wraps TodoState with an additional "All" category.
 */
export enum StateFilterOption {
  ALL = "All",
  TODO = TodoState.TODO,
  IN_PROGRESS = TodoState.IN_PROGRESS,
  DONE = TodoState.DONE,
}




/**
 * Active filtering state used in the UI.
 */
export interface TodoFilters {
  searchQuery: string;
  stateFilter: StateFilterOption;
  dateFilter: DateFilterOption;
  customDateFrom: string;
  customDateTo: string;
}

/**
 * Summary counts of TODOs by state.
 */
export interface TodoStats {
  all: number;
  [TodoState.TODO]: number;
  [TodoState.IN_PROGRESS]: number;
  [TodoState.DONE]: number;
}
