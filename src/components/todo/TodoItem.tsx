/**
 * Individual TODO item component
 *
 * Purpose: Display a single todo with all its information
 * Responsibility: Purely presentational, delegates actions to parent
 * Pattern: Presentational component (no business logic)
 */

"use client";

import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Calendar, User } from "lucide-react";
import { Todo, TodoState, ViewMode } from "../../types/todo";
import { formatDate, isOverdue } from "../../lib/dateUtils";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (taskId: string) => void;
  viewMode: ViewMode;
}

export function TodoItem({ todo, onEdit, onDelete, viewMode }: TodoItemProps) {
  // Determine badge variant based on todo state
  const getStateBadgeVariant = (
    state: string
  ): "default" | "secondary" | "outline" => {
    switch (state) {
      case TodoState.DONE:
        return "default";
      case TodoState.IN_PROGRESS:
        return "secondary";
      default:
        return "outline";
    }
  };

  const overdueStatus = isOverdue(todo.dueDate, todo.state === TodoState.DONE);

  // Handler to stop propagation when clicking dropdown menu
  const handleDropdownClick = (e: React.MouseEvent): void => {
    console.log("clicked");
    e.stopPropagation();
  };

  return (
    <Card
      className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
        viewMode === "list" ? "w-full" : ""
      }`}
      onClick={() => onEdit(todo)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Status badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={getStateBadgeVariant(todo.state)}>
              {todo.state}
            </Badge>
            {overdueStatus && (
              <Badge
                variant="destructive"
                className="bg-destructive text-destructive-foreground"
              >
                Overdue
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="mb-3 break-words">{todo.description}</p>

          {/* Metadata (user and date) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="break-all">{todo.userId}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(todo.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Actions dropdown */}
        <div onClick={handleDropdownClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicked trigger");
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.taskId);
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
