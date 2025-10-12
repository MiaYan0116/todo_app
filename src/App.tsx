/**
 * Main application component
 * 
 * Purpose: Orchestrate the entire TODO application
 * Responsibility: 
 *   - Provide global context (TodoProvider)
 *   - Manage UI state (filters, view mode, modal state)
 *   - Coordinate communication between components
 * 
 * Architecture:
 *   - Uses TodoContext for todo data (separation of concerns)
 *   - Keeps UI state local (filters, view preferences)
 *   - Delegates rendering to specialized components
 *   - Acts as the "smart" container component
 */

"use client";

import { useState } from "react";
import { Toaster } from "sonner@2.0.3";
import { ThemeProvider } from "next-themes@0.4.6";
import { TodoProvider, useTodos } from "./context/TodoContext";
import { AppHeader } from "./components/layout/AppHeader";
import { TodoStats } from "./components/layout/TodoStats";
import { TodoFilters } from "./components/layout/TodoFilters";
import { TodoList } from "./components/todo/TodoList";
import { TodoForm } from "./components/todo/TodoForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { applyAllFilters, calculateStats } from "./lib/filterUtils";
import { Todo, TodoFilters as TodoFiltersType, ViewMode } from "./types/todo";

// Main app content - separated to use context hooks
function AppContent(): JSX.Element {
  // Global todo state from context
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  // Local UI state (not shared globally)
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("viewMode", "list");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Filter state
  const [filters, setFilters] = useState<TodoFiltersType>({
    searchQuery: "",
    stateFilter: "All",
    dateFilter: "All",
    customDateFrom: "",
    customDateTo: "",
  });

  // Derived state: Apply filters and calculate stats
  const filteredTodos = applyAllFilters(todos, filters);
  const stats = calculateStats(todos);

  // Event handlers
  const handleToggleViewMode = (): void => {
    setViewMode(viewMode === "list" ? "grid" : "list");
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

  const handleFiltersChange = (newFilters: Partial<TodoFiltersType>): void => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearAllFilters = (): void => {
    setFilters({
      searchQuery: "",
      stateFilter: "All",
      dateFilter: "All",
      customDateFrom: "",
      customDateTo: "",
    });
  };

  const hasActiveFilters =
    filters.searchQuery || filters.stateFilter !== "All" || filters.dateFilter !== "All";

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
export default function App(): JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}
