/**
 * App.tsx
 * ------------
 * Root component orchestrating the TODO application.
 * Responsibilities:
 * - Wraps providers (ThemeProvider, TodoProvider)
 * - Manages UI states (filters, view mode, modal visibility)
 * - Coordinates child components
 */

"use client";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { TodoProvider, useTodos } from "./context/TodoContext";
import { AppHeader } from "./components/layout/AppHeader";
import { TodoStats } from "./components/layout/TodoStats";
import { TodoFilters } from "./components/layout/TodoFilters";
import { TodoList } from "./components/todo/TodoList";
import { TodoForm } from "./components/todo/TodoForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { applyAllFilters, calculateStats } from "./lib/filterUtils";
import {
  Todo,
  TodoFilters as TodoFiltersType,
  ViewMode,
  StateFilterOption,
  DateFilterOption,
} from "./types/todo";

const DEFAULT_FILTERS: TodoFiltersType = {
  searchQuery: "",
  stateFilter: StateFilterOption.ALL,
  dateFilter: DateFilterOption.ALL,
  customDateFrom: "",
  customDateTo: "",
};

// Main app content - separated to use context hooks
function AppContent() {
  // Global todo state from context
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  // Local UI state (not shared globally)
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "viewMode",
    ViewMode.LIST
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Filter state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Derived state: Apply filters and calculate stats
  const filteredTodos = applyAllFilters(todos, filters);
  const stats = calculateStats(todos);

  // Event handlers
  const handleToggleViewMode = (): void => {
    setViewMode(viewMode === ViewMode.LIST ? ViewMode.GRID : ViewMode.LIST);
  };

  const handleAddTodo = (): void => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  const handleEditTodo = (todo: Todo): void => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleSaveTodo = (todo: Todo): void => {
    if (editingTodo) {
      updateTodo(todo);
    } else {
      addTodo(todo);
    }
  };

  const handleFiltersChange = (newFilters: Partial<TodoFiltersType>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearAllFilters = (): void => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    !!filters.searchQuery ||
    filters.stateFilter !== StateFilterOption.ALL ||
    filters.dateFilter !== DateFilterOption.ALL;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Application header */}
      <AppHeader
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onAddTodo={handleAddTodo}
      />

      {/* Main content area */}
      <main className="container mx-auto px-4 py-6">
        {/* Statistics dashboard */}
        <div className="mb-6">
          <TodoStats stats={stats} />
        </div>

        {/* Filter controls */}
        <div className="mb-6">
          <TodoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearAll={handleClearAllFilters}
          />
        </div>

        {/* Todo list/grid */}
        <TodoList
          todos={filteredTodos}
          viewMode={viewMode}
          onToggleViewMode={handleToggleViewMode}
          onEdit={handleEditTodo}
          onDelete={deleteTodo}
          onAddTodo={handleAddTodo}
          hasActiveFilters={hasActiveFilters}
        />
      </main>

      {/* Todo form modal */}
      <TodoForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </div>
  );
}

// Root component: Wraps app in providers
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}
