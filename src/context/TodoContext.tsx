/**
 * TodoContext.tsx
 * -------------------------------------
 * Global state management for TODO data.
 * Pattern: React Context + useReducer
 * Responsibilities:
 * - Manage todos and CRUD actions
 * - Sync with localStorage
 * - Provide a type-safe API to consumers
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Todo } from "../types/todo";
import { toast } from "sonner";

// Action types for reducer (enables type-safe dispatch)
export enum TodoActionType {
  SET_TODOS = "SET_TODOS",
  ADD_TODO = "ADD_TODO",
  UPDATE_TODO = "UPDATE_TODO",
  DELETE_TODO = "DELETE_TODO",
}

type TodoAction =
  | { type: TodoActionType.SET_TODOS; payload: Todo[] }
  | { type: TodoActionType.ADD_TODO; payload: Todo }
  | { type: TodoActionType.UPDATE_TODO; payload: Todo }
  | { type: TodoActionType.DELETE_TODO; payload: string };

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
    case TodoActionType.SET_TODOS:
      return action.payload;

    case TodoActionType.ADD_TODO:
      return [...state, action.payload];

    case TodoActionType.UPDATE_TODO:
      return state.map((todo) =>
        todo.taskId === action.payload.taskId ? action.payload : todo
      );

    case TodoActionType.DELETE_TODO:
      return state.filter((todo) => todo.taskId !== action.payload);

    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
};

// Provider component: Wraps application and provides todo state
export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        dispatch({
          type: TodoActionType.SET_TODOS,
          payload: JSON.parse(storedTodos),
        });
      }
    } catch (err) {
      console.error("Failed to load todos:", err);
      localStorage.removeItem("todos");
    }
  }, []);

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (err) {
      console.error("Failed to persist todos:", err);
    }
  }, [todos]);

  // Action creators: Wrap dispatch calls with business logic
  const addTodo = (todo: Todo): void => {
    dispatch({ type: TodoActionType.ADD_TODO, payload: todo });
    toast.success("TODO added successfully!");
  };

  const updateTodo = (todo: Todo): void => {
    dispatch({ type: TodoActionType.UPDATE_TODO, payload: todo });
    toast.success("TODO updated successfully!");
  };

  const deleteTodo = (taskId: string): void => {
    dispatch({ type: TodoActionType.DELETE_TODO, payload: taskId });
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
