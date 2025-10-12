/**
 * TODO list container component
 * 
 * Purpose: Render a list/grid of todos or empty state
 * Responsibility: Layout orchestration, delegates rendering to TodoItem
 * Pattern: Container/presenter pattern
 */

"use client";

import { Button } from "../ui/button";
import { Plus, Grid3x3, List } from "lucide-react";
import { TodoItem } from "./TodoItem";
import { Todo, ViewMode } from "../../types/todo";

interface TodoListProps {
  todos: Todo[];
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (taskId: string) => void;
  onAddTodo: () => void;
  hasActiveFilters: boolean;
}

export function TodoList({
  todos,
  viewMode,
  onToggleViewMode,
  onEdit,
  onDelete,
  onAddTodo,
  hasActiveFilters,
}: TodoListProps): JSX.Element {
  // Empty state
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground mb-4">
          {hasActiveFilters
            ? "No TODOs found matching your filters."
            : "No TODOs yet. Create your first one!"}
        </p>
        {!hasActiveFilters && (
          <Button onClick={onAddTodo}>
            <Plus className="h-5 w-5 mr-2" />
            Add Your First TODO
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile view mode toggle */}
      <div className="flex sm:hidden justify-end mb-4">
        <Button variant="outline" size="sm" onClick={onToggleViewMode}>
          {viewMode === "list" ? (
            <>
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid View
            </>
          ) : (
            <>
              <List className="h-4 w-4 mr-2" />
              List View
            </>
          )}
        </Button>
      </div>

      {/* Todo items in list or grid layout */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-4"
        }
      >
        {todos.map((todo) => (
          <TodoItem
            key={todo.taskId}
            todo={todo}
            onEdit={onEdit}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
}
