"use client";
import React from "react";
import { Button } from "./ui/button";
import { Plus, Grid3x3, List, Moon, Sun } from "lucide-react";
import { Theme, ViewMode } from "../types/const";

interface AppHeaderProps {
  theme: "light" | "dark";
  viewMode: ViewMode;
  onToggleTheme: () => void;
  onToggleViewMode: () => void;
  onAddTodo: () => void;
}

export function AppHeader({
  theme,
  viewMode,
  onToggleTheme,
  onToggleViewMode,
  onAddTodo,
}: AppHeaderProps) {
  const iconColor = theme === "light" ? "#18181b" : "#f4f4f5";
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
            <Button variant="ghost" size="icon" onClick={onToggleTheme}>
              {theme === "light" ? (
                <Moon className="h-5 w-5" color={iconColor} />
              ) : (
                <Sun className="h-5 w-5" color={iconColor} />
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
