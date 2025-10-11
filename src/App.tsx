import React, { useState } from "react";
import "./App.css";
import { useTheme } from "./hooks/useTheme";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { AppHeader } from "./components/AppHeader";
import { Todo, ViewMode, ViewModeEnum } from "./types/const";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "viewMode",
    ViewModeEnum.LIST
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleToggleViewMode = () => {
    setViewMode(
      viewMode === ViewModeEnum.LIST ? ViewModeEnum.GRID : ViewModeEnum.LIST
    );
  };

  const handleAddTodo = () => {
    alert("add todo");
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  return (
    <>
      <div className="border-b bg-card text-foreground">
        <AppHeader
          theme={theme}
          viewMode={viewMode}
          onToggleTheme={toggleTheme}
          onToggleViewMode={handleToggleViewMode}
          onAddTodo={handleAddTodo}
        />
      </div>
    </>
  );
}

export default App;
