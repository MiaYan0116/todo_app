/**
 * Application header component
 *
 * Purpose: Displays app branding and primary actions
 * Responsibility: Theme toggle, view mode toggle, add todo button
 * Pattern: Presentational component with callback props
 */

"use client";

import React from "react";
import { Button } from "../ui/button";
import { Plus, Grid3x3, List, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ViewMode } from "../../types/todo";

interface AppHeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onAddTodo: () => void;
}

export function AppHeader({
  viewMode,
  onToggleViewMode,
  onAddTodo,
}: AppHeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1>TODO Manager</h1>

          <div className="flex items-center gap-2">
            {/* View mode toggle - hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleViewMode}
              className="hidden sm:flex"
              title={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
            >
              {viewMode === "list" ? (
                <Grid3x3 className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Primary action */}
            <Button onClick={onAddTodo}>
              <Plus className="h-5 w-5 mr-2" />
              Add TODO
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
