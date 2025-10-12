/**
 * Central state management for TODO application
 * 
 * Purpose: Provide global state and actions for todos via React Context
 * Benefits: Eliminates prop drilling, single source of truth, testable reducer
 * Pattern: Context + useReducer for predictable state updates
 * 
 * Architecture Note: This context manages ONLY todo data and CRUD operations.
 * UI state (filters, view mode) is kept in components for better separation.
 */

"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Todo } from "../types/todo";
import { toast } from "sonner@2.0.3";

// Action types for reducer (enables type-safe dispatch)
type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string };

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (taskId: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Reducer function: Pure function that describes state transitions
const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET_TODOS":
      return action.payload;
    
    case "ADD_TODO":
      return [...state, action.payload];
    
    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.taskId === action.payload.taskId ? action.payload : todo
      );
    
    case "DELETE_TODO":
      return state.filter((todo) => todo.taskId !== action.payload);
    
    default:
      return state;
  }
}

// Provider component: Wraps application and provides todo state
export function TodoProvider({ children }: { children: ReactNode }): JSX.Element {
  const [todos, dispatch] = useReducer(todoReducer, []);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        dispatch({ type: "SET_TODOS", payload: JSON.parse(storedTodos) });
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  // Action creators: Wrap dispatch calls with business logic
  const addTodo = (todo: Todo): void => {
    dispatch({ type: "ADD_TODO", payload: todo });
    toast.success("TODO added successfully!");
  };

  const updateTodo = (todo: Todo): void => {
    dispatch({ type: "UPDATE_TODO", payload: todo });
    toast.success("TODO updated successfully!");
  };

  const deleteTodo = (taskId: string): void => {
    dispatch({ type: "DELETE_TODO", payload: taskId });
    toast.success("TODO deleted successfully!");
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook: Provides type-safe access to context
export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
}
